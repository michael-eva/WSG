import { getTotalCashOnHand, getPackedCashData, getBankingData, getDepositBagData, getUnverifiedClientReimbursements, getInTransitCashData, getMiscData, deleteMiscData, setMiscData, getOutstandingOrders } from "../utils";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/utils/utils";

type CashOnHand = {
    totalfifty: number;
    totaltwenty: number;
    totalten: number;
    totalfive: number;
    totaltwo: number;
    totalone: number;
    totalfiftyc: number;
    totaltwentyc: number;
    totaltenc: number;
    totalfivec: number;
    totalgrandtotal: number;
    totalcointotal: number;
    totalnotetotal: number;
}

type PendingCashSwap = {
    clientName: string
    grandTotal: number;
    id?: number
}

export function Assets({ setAssets }: any) {
    const [cashOnHand, setCashOnHand] = useState<CashOnHand | null>(null)
    const [bankBalance, setBankBalance] = useState<number>(0)
    const [packedCashValue, setPackedCashValue] = useState({ grandTotal: 0, coinTotal: 0, noteTotal: 0 })
    const [packedCash, setPackedCash] = useState<{ clientName: string, grandTotal: number, id?: number }[]>([])
    const [outstandingBankingValue, setOutstandingBankingValue] = useState<number | null>(0)
    const [outstandingBanking, setOutstandingBanking] = useState<{ clientName: string, grandTotal: number, id?: number }[] | null>(null)
    const [outstandingDepositBags, setOutstandingDepositBags] = useState<{ value: number, bagId: string }[]>([])
    const [outstandingDepositBagValue, setOutstandingDepositBagValue] = useState<number | null>(0)
    const [dispatchedCashValue, setDispatchedCashValue] = useState<number | null>(0)
    const [dispatchedCash, setDispatchedCash] = useState<{ clientName: string, grandTotal: number, id?: number }[]>([])
    const [unverifiedClientReimbursementTotal, setUnverifiedClientReimbursementTotal] = useState<number | null | undefined>(0)
    const [pendingCashSwap, setPendingCashSwap] = useState<PendingCashSwap[] | null>(null)
    const [showInput, setShowInput] = useState<boolean>(false)
    const [selectedName, setSelectedName] = useState<string | null | undefined>(null)
    const [unknownValueInput, setUnknownValueInput] = useState<number | null>(null)
    const [unknownValueTotal, setUnknownValue] = useState<number | null>(null)
    const [unknownData, setUnknownData] = useState<{ name: string, value: number, status?: string }[]>([])
    const [outstandingOrders, setOutstandingOrders] = useState<{ clientName: string, grandTotal: number, id?: number }[]>([])
    const [totalOutstandingOrders, setTotalOutstandingOrders] = useState<number | null>(0)

    const cashOnHandTotal = (cashOnHand?.totalgrandtotal ?? 0) + packedCashValue.grandTotal + (dispatchedCashValue ?? 0);
    const totalOutstandingDeposits = (outstandingDepositBagValue ?? 0)
    const totalOutstandingPayments = unverifiedClientReimbursementTotal
    const totalCash = ((cashOnHandTotal + totalOutstandingDeposits + bankBalance + (totalOutstandingPayments ?? 0) + (outstandingBankingValue ?? 0)) + (totalOutstandingOrders ?? 0) + (unknownValueTotal ?? 0));


    const assetsForBalanceSheetInput = {
        bankAccount: bankBalance,
        cashOnHand: {
            float: cashOnHand?.totalgrandtotal,
            packedCash: {
                packedCash: packedCash,
                total: packedCashValue
            },
            cashInTransit: {
                dispatchedCash,
                total: dispatchedCashValue
            },
            total: cashOnHandTotal
        },
        outstandingDeposits: {
            outstandingDepositBags,
            total: outstandingDepositBagValue
        },
        outstandingBanking: {
            outstandingBanking,
            total: outstandingBankingValue
        },
        outstandingPayments: {
            outstandingPayments: pendingCashSwap,
            total: unverifiedClientReimbursementTotal
        },
        miscellaneous: {
            miscellaneous: unknownData,
            total: unknownValueTotal
        },
        grandTotal: totalCash
    }

    useEffect(() => {
        getTotalCashOnHand().then((data) => setCashOnHand(data))
        getPackedCashData().then(({ grandTotal, coinTotal, noteTotal, packedCash }) => {
            setPackedCashValue({ grandTotal, coinTotal, noteTotal });
            setPackedCash(packedCash);
        })
        getBankingData()
            .then(({ outstandingBankingValue, outstandingBanking }) => {
                setOutstandingBankingValue(outstandingBankingValue);
                setOutstandingBanking(outstandingBanking);

            })
        getDepositBagData()
            .then(({ outstandingDepositBagValue, outstandingDepositBags }) => {
                setOutstandingDepositBagValue(outstandingDepositBagValue);
                setOutstandingDepositBags(outstandingDepositBags);
            })
        getUnverifiedClientReimbursements()
            .then(({ totalUnverifiedClientReimbursements, pendingCashSwap }) => {
                setUnverifiedClientReimbursementTotal(totalUnverifiedClientReimbursements);
                setPendingCashSwap(pendingCashSwap);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        getInTransitCashData()
            .then(({ dispatchedCash, totalGrandTotal }) => {
                setDispatchedCashValue(totalGrandTotal)
                setDispatchedCash(dispatchedCash)
            });
        getMiscData()
            .then(({ misc, totalMisc }) => {
                setUnknownData(misc)
                setUnknownValue(totalMisc)
            });
        //@ts-ignore
        getOutstandingOrders().then(({ outstandingOrders, totalOutstandingOrders }) => {
            setOutstandingOrders(outstandingOrders)
            setTotalOutstandingOrders(totalOutstandingOrders)
        })


    }, [])
    useEffect(() => {
        setAssets(assetsForBalanceSheetInput)
    }, [totalCash])
    async function onDeleteClick(name: string) {
        await deleteMiscData(name).then(() => {
            getMiscData().then(({ misc, totalMisc }) => {
                setUnknownData(misc)
                setUnknownValue(totalMisc)
            })
        })
    }
    async function onUnknownSaveClick() {
        setShowInput(false)
        const deposit = {
            name: selectedName,
            value: unknownValueInput,
        }
        await setMiscData(deposit).then(() => {
            getMiscData().then(({ misc, totalMisc }) => {
                setUnknownData(misc)
                setUnknownValue(totalMisc)
            })
        })
        setSelectedName(null)
        setUnknownValue(null)
    }


    return (
        <div className=" rounded-lg">
            <Table className="">
                <TableHeader>
                    <TableRow>
                        <TableHead colSpan={4} className=" text-center text-lg bg-gray-200">Assets</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead >Asset</TableHead>
                        <TableHead>Breakdown</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="">Bank Account</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <Input type="number" value={bankBalance || ""} onChange={(e) => setBankBalance(Number(e.target.value))} className=" w-32" />
                        </TableCell>
                        <TableCell className="">{formatNumber(bankBalance)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell rowSpan={3} className="">Cash on hand</TableCell>
                        <TableCell>
                            <Dialog >
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline">Float
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="min-w-[1000px]">
                                    <DialogHeader>
                                        <DialogTitle>Float
                                        </DialogTitle>
                                        <DialogDescription>
                                            Float balances.
                                        </DialogDescription>
                                        <ScrollArea className="max-h-48">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>$50</TableHead>
                                                        <TableHead>$20</TableHead>
                                                        <TableHead>$10</TableHead>
                                                        <TableHead>$5</TableHead>
                                                        <TableHead>$2</TableHead>
                                                        <TableHead>$1</TableHead>
                                                        <TableHead>50c</TableHead>
                                                        <TableHead>20c</TableHead>
                                                        <TableHead>10c</TableHead>
                                                        <TableHead>5c</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>{formatNumber(cashOnHand?.totalfifty)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totaltwenty)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totalten)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totalfive)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totaltwo)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totalone)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totalfiftyc)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totaltwentyc)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totaltenc)}</TableCell>
                                                        <TableCell>{formatNumber(cashOnHand?.totalfivec)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <div className="flex gap-3 items-center">
                                                <div className="font-semibold text-md">Total float:</div>
                                                <div className="font-bold">
                                                    {formatNumber(cashOnHand?.totalgrandtotal)}
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog></TableCell>
                        <TableCell >{formatNumber(cashOnHand?.totalgrandtotal)}</TableCell>
                        <TableCell rowSpan={3} className="">{formatNumber(cashOnHandTotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline ">Packed cash
                                        <span> ({packedCash && packedCash.length})</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Packed cash
                                            <span> ({packedCash && packedCash.length})</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            A list of packed cash.
                                        </DialogDescription>
                                        <ScrollArea className="max-h-48 ">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Client Name</TableHead>
                                                        <TableHead>Value</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {packedCash?.map(({ clientName, grandTotal, id }) => (
                                                        <TableRow key={id}>
                                                            <TableCell>{clientName}</TableCell>
                                                            <TableCell>{formatNumber(grandTotal)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog></TableCell>
                        <TableCell >{formatNumber(packedCashValue.grandTotal)}</TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell><Dialog>
                            <DialogTrigger asChild>
                                <button className="text-blue-500 underline ">Cash in transit
                                    <span> ({dispatchedCash && dispatchedCash.length})</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Cash in transit
                                        <span> ({dispatchedCash && dispatchedCash.length})</span>
                                    </DialogTitle>
                                    <DialogDescription>
                                        A list of cash in transit.
                                    </DialogDescription>
                                    <ScrollArea className="max-h-48 ">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Client Name</TableHead>
                                                    <TableHead>Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {dispatchedCash?.map(({ clientName, grandTotal, id }) => (
                                                    <TableRow key={id}>
                                                        <TableCell>{clientName}</TableCell>
                                                        <TableCell>{formatNumber(grandTotal)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog></TableCell>
                        <TableCell >{formatNumber(dispatchedCashValue)}</TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell className="">
                            Outstanding deposits</TableCell>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline ">Outstanding deposits
                                        <span> ({outstandingDepositBags && outstandingDepositBags.length})</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Outstanding deposits
                                            <span> ({outstandingDepositBags && outstandingDepositBags.length})</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            A list of deposit bags which are yet to be receipted in bank account.
                                        </DialogDescription>
                                        <ScrollArea className="max-h-48 ">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Bag Id</TableHead>
                                                        <TableHead>Value</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {outstandingDepositBags?.map(({ bagId, value }) => (
                                                        <TableRow key={bagId}>
                                                            <TableCell>{bagId}</TableCell>
                                                            <TableCell>{formatNumber(value)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="default">
                                            <Link href="/management/banking">More details</Link>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell ></TableCell>
                        <TableCell className="">{formatNumber(totalOutstandingDeposits)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="flex items-center ">
                            Oustanding banking
                        </TableCell>
                        <TableCell >
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline ">Outstanding banking
                                        <span> ({outstandingBanking && outstandingBanking.length})</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Outstanding banking
                                            <span> ({outstandingBanking && outstandingBanking.length})</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            A list of cash which has been counted but yet to be banked.
                                        </DialogDescription>
                                        <ScrollArea className="max-h-48 ">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Client</TableHead>
                                                        <TableHead>Value</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {outstandingBanking?.map(({ clientName, grandTotal, id }) => (
                                                        <TableRow key={id}>
                                                            <TableCell>{clientName}</TableCell>
                                                            <TableCell>{formatNumber(grandTotal)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="default">
                                            <Link href="/management/banking">More details</Link>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell ></TableCell>
                        <TableCell className="">{formatNumber(outstandingBankingValue)}</TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell className="">Outstanding payments</TableCell>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline ">Unverified reimbursement due
                                        <span> ({pendingCashSwap && pendingCashSwap.length})</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Unverified reimbursement due
                                            <span> ({pendingCashSwap && pendingCashSwap.length})</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            A list of all the cash swaps received which have yet to be counted.
                                        </DialogDescription>

                                        <ScrollArea className="max-h-48 ">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Client</TableHead>
                                                        <TableHead>Value</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {pendingCashSwap?.map(({ clientName, grandTotal, id }) => (
                                                        <TableRow key={id}>
                                                            <TableCell>{clientName}</TableCell>
                                                            <TableCell>{formatNumber(grandTotal)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell />
                        <TableCell className="">{formatNumber(totalOutstandingPayments)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Armaguard Orders</TableCell>
                        <TableCell><Dialog>
                            <DialogTrigger asChild>
                                <button className="text-blue-500 underline">Armaguard Orders
                                    <span> ({outstandingOrders && outstandingOrders.length})</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[490px]">
                                <DialogHeader>
                                    <DialogTitle>Unknown
                                        <span> ({outstandingOrders && outstandingOrders.length})</span>
                                    </DialogTitle>
                                    <DialogDescription>
                                        A list of unknown bank deposits.
                                    </DialogDescription>
                                    {!showInput ? <ScrollArea className="max-h-48 ">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {outstandingOrders?.map(({ clientName, grandTotal }) => (
                                                    <TableRow key={clientName}>
                                                        <TableCell>{clientName}</TableCell>
                                                        <TableCell>{formatNumber(grandTotal)}</TableCell>
                                                        <TableCell className="px-0 mx-auto flex">
                                                            <div
                                                                onClick={() => onDeleteClick(clientName)}
                                                                className="border text-center p-1 px-1.5 border-red-300 text-red-300 hover:text-red-600 hover:border-red-600 cursor-pointer">
                                                                X
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                        :
                                        <Table >
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody >
                                                <TableRow>
                                                    <TableCell className=" w-1/2">
                                                        <Input
                                                            type="text"
                                                            onChange={(e) => setSelectedName(e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <Input type="number" onChange={(e) => setUnknownValueInput(parseFloat(e.target.value))} />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    }
                                </DialogHeader>
                                <DialogFooter>
                                    {!showInput ?

                                        <Button variant="default" onClick={() => setShowInput(true)}>
                                            Input order
                                        </Button>

                                        :
                                        <div className="space-x-4">
                                            <Button variant='outline' onClick={() => { setShowInput(false); setSelectedName(""), setUnknownValueInput(null) }}>Cancel</Button>
                                            <Button onClick={onUnknownSaveClick} disabled={selectedName?.length === 0 || unknownValueInput === null}>Save</Button>
                                        </div>
                                    }
                                </DialogFooter>
                            </DialogContent>
                        </Dialog></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{formatNumber(totalOutstandingOrders)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Miscellaneous</TableCell>
                        <TableCell><Dialog>
                            <DialogTrigger asChild>
                                <button className="text-blue-500 underline">Unknown
                                    <span> ({unknownData && unknownData.length})</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[490px]">
                                <DialogHeader>
                                    <DialogTitle>Unknown
                                        <span> ({unknownData && unknownData.length})</span>
                                    </DialogTitle>
                                    <DialogDescription>
                                        A list of unknown bank deposits.
                                    </DialogDescription>
                                    {!showInput ? <ScrollArea className="max-h-48 ">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {unknownData?.map(({ name, value }) => (
                                                    <TableRow key={name}>
                                                        <TableCell>{name}</TableCell>
                                                        <TableCell>{formatNumber(value)}</TableCell>
                                                        <TableCell className="px-0 mx-auto flex">
                                                            <div
                                                                onClick={() => onDeleteClick(name)}
                                                                className="border text-center p-1 px-1.5 border-red-300 text-red-300 hover:text-red-600 hover:border-red-600 cursor-pointer">
                                                                X
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                        :
                                        <Table >
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody >
                                                <TableRow>
                                                    <TableCell className=" w-1/2">
                                                        <Input
                                                            type="text"
                                                            onChange={(e) => setSelectedName(e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <Input type="number" onChange={(e) => setUnknownValueInput(parseFloat(e.target.value))} />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    }
                                </DialogHeader>
                                <DialogFooter>
                                    {!showInput ?

                                        <Button variant="default" onClick={() => setShowInput(true)}>
                                            Input order
                                        </Button>

                                        :
                                        <div className="space-x-4">
                                            <Button variant='outline' onClick={() => { setShowInput(false); setSelectedName(""), setUnknownValueInput(null) }}>Cancel</Button>
                                            <Button onClick={onUnknownSaveClick} disabled={selectedName?.length === 0 || unknownValueInput === null}>Save</Button>
                                        </div>
                                    }
                                </DialogFooter>
                            </DialogContent>
                        </Dialog></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{formatNumber(unknownValueTotal)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-200">
                        <TableCell colSpan={3}><p className="text-lg font-semibold">TOTAL CASH AVAILABLE</p></TableCell>
                        <TableCell ><p className="text-lg font-semibold">{formatNumber(totalCash)}</p></TableCell>
                    </TableRow>
                </TableBody>
            </Table >
        </div>
    )
}
