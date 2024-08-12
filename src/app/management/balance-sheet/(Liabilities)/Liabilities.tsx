'use client'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { deleteUnknownBankDeposit, getClientsPayable, getEFTs, getUnknownData, setBalanceSheetData, setEFTChangeOrderData, setUnknownBankDeposit } from "../utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { getClients } from "../../utils";
import Link from "next/link";
import Select from 'react-select';
import { formatNumber } from "@/utils/utils";
type ClientPayable = {
    grandTotal: number;
    clientName: string;
};
export function Liabilities({ setLiabilities }: any) {
    const [clientsPayable, setClientsPayable] = useState<ClientPayable[]>([])
    const [totalClientsPayable, setTotalClientsPayable] = useState<number>()
    const [clients, setClients] = useState<{ name: string }[]>([])
    const [showInput, setShowInput] = useState<boolean>(false)
    const [selectedClient, setSelectedClient] = useState<string | null | undefined>(null)
    const [value, setValue] = useState<number | null>(null)
    const [EFTData, setEFTData] = useState<{ clientName: string, eftValue: number, status: string, isEFT: boolean }[]>([])

    const [totalEFT, setTotalEFT] = useState<number>()

    const packedEFTs = EFTData.filter(({ status }) => status === 'packed')
    const notPackedEFTs = EFTData.filter(({ status, isEFT }) =>
        status === 'pending_eft_processing' || status === "unprocessed"
    )
    const cashInTransitEFTs = EFTData.filter(({ status, isEFT }) =>
        (status === "dispatched")
    )
    console.log(cashInTransitEFTs)
    const [selectedName, setSelectedName] = useState<string | null | undefined>(null)
    const [unknownValueTotal, setUnknownValue] = useState<number | null>(null)
    const [unknownData, setUnknownData] = useState<{ name: string, value: number, status?: string }[]>([])
    const [unknownValueInput, setUnknownValueInput] = useState<number | null>(null)

    useEffect(() => {
        getClientsPayable().then(({ totalClientsPayable, clientsPayable }) => {
            setTotalClientsPayable(totalClientsPayable);
            setClientsPayable(clientsPayable);
        })
        getClients().then((data) => setClients(data))
        getEFTs().then(({ EFTs, totalEFT }) => {
            setEFTData(EFTs)
            setTotalEFT(totalEFT)
        })
        getUnknownData().then(({ unknowns, totalUnknown }) => {
            setUnknownData(unknowns)
            setUnknownValue(totalUnknown)
        })
    }, [])
    const EFTChangeOrder = {
        clientName: selectedName,
        isEFT: true,
        eftValue: value,
    }

    async function onSaveClick() {
        setShowInput(false)
        await setEFTChangeOrderData({ EFTChangeOrder }).then(() => {
            getEFTs().then(({ EFTs, totalEFT }) => {
                setEFTData(EFTs)
                setTotalEFT(totalEFT)
            })
        })
        setSelectedClient(null)
        setValue(null)
    }
    async function onUnknownSaveClick() {
        setShowInput(false)
        const deposit = {
            name: selectedName,
            value: unknownValueInput,
        }
        await setUnknownBankDeposit(deposit).then(() => {
            getUnknownData().then(({ unknowns, totalUnknown }) => {
                setUnknownData(unknowns)
                setUnknownValue(totalUnknown)
            })
        })
        setSelectedName(null)
        setUnknownValue(null)
    }
    async function onDeleteClick(name: string) {
        await deleteUnknownBankDeposit(name).then(() => {
            getUnknownData().then(({ unknowns, totalUnknown }) => {
                setUnknownData(unknowns)
                setUnknownValue(totalUnknown)
            })
        })
    }

    const totalPayable = (totalClientsPayable ?? 0) + (totalEFT ?? 0) + (unknownValueTotal ?? 0)
    const liabilitiesForBalanceSheetInput = {
        outstandingOrders: {
            packedEFT: {
                packedEFTs,
                total: packedEFTs.reduce((acc, record) => acc + (record.eftValue || 0), 0)
            },
            notPackedEFT: {
                notPackedEFTs,
                total: notPackedEFTs.reduce((acc, record) => acc + (record.eftValue || 0), 0)
            },
            total: totalEFT
        },
        outstandingPayments: {
            outstandingPayments: clientsPayable,
            total: totalClientsPayable
        },
        miscellaneous: {
            miscellaneous: unknownData,
            total: unknownValueTotal
        },
        grandTotal: totalPayable
    }
    useEffect(() => {
        setLiabilities(liabilitiesForBalanceSheetInput)
    }, [totalPayable])

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead colSpan={4} className=" text-center text-lg bg-gray-200">Liabilities</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead>Liability</TableHead>
                        <TableHead>Breakdown</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell rowSpan={3}>Outstanding orders</TableCell>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline">Packed (EFT's)
                                        <span> ({packedEFTs && packedEFTs.length})</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Packed (EFT's)
                                            <span> ({packedEFTs && packedEFTs.length})</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            A list of EFT change orders which have been packed.
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
                                                    {packedEFTs?.map(({ clientName, eftValue }) => (
                                                        <TableRow key={clientName}>
                                                            <TableCell>{clientName}</TableCell>
                                                            <TableCell>{formatNumber(eftValue)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </ScrollArea>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="default">
                                            <Link href="/cash-room/change-order?status=packed">More details</Link>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell>{formatNumber(packedEFTs.reduce((acc, record) => acc + (record.eftValue || 0), 0))}</TableCell>
                        <TableCell rowSpan={3}>{formatNumber(totalEFT)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline">Not packed (EFT's)
                                        <span> ({notPackedEFTs && notPackedEFTs.length})</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[490px]">
                                    <DialogHeader>
                                        <DialogTitle>Not packed (EFT's)
                                            <span> ({notPackedEFTs && notPackedEFTs.length})</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            A list of EFT change orders which have yet to be packed.
                                        </DialogDescription>
                                        {!showInput ? <ScrollArea className="max-h-48 ">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Client</TableHead>
                                                        <TableHead>Value</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {notPackedEFTs?.map(({ clientName, eftValue }) => (
                                                        <TableRow key={clientName}>
                                                            <TableCell>{clientName}</TableCell>
                                                            <TableCell>{formatNumber(eftValue)}</TableCell>
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
                                                            <Select
                                                                options={clients.map((client, index) => ({
                                                                    value: client.name,
                                                                    label: client.name,
                                                                    key: index
                                                                }))}
                                                                onChange={(selectedOption) => setSelectedName(selectedOption?.value)}
                                                                // onChange={(selectedOption) => setSelectedName(selectedOption?.value)}
                                                                placeholder="Select client"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="">
                                                            <Input type="number" onChange={(e) => setValue(parseFloat(e.target.value))} />
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
                                                <Button variant='outline' onClick={() => setShowInput(false)}>Cancel</Button>
                                                <Button onClick={onSaveClick} disabled={selectedClient?.length === null || value === null}>Save</Button>
                                            </div>
                                        }
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell >{formatNumber(notPackedEFTs.reduce((acc, record) => acc + (record.eftValue || 0), 0))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="text-blue-500 underline">Cash in transit (EFT's)
                                        <span> ({cashInTransitEFTs && cashInTransitEFTs.length})</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[490px]">
                                    <DialogHeader>
                                        <DialogTitle>Cash in transit (EFT's)
                                            <span> ({cashInTransitEFTs && cashInTransitEFTs.length})</span>
                                        </DialogTitle>
                                        <DialogDescription>
                                            A list of EFT change orders which have been dispatched.
                                        </DialogDescription>
                                        {!showInput ? <ScrollArea className="max-h-48 ">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Client</TableHead>
                                                        <TableHead>Value</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {cashInTransitEFTs?.map(({ clientName, eftValue }) => (
                                                        <TableRow key={clientName}>
                                                            <TableCell>{clientName}</TableCell>
                                                            <TableCell>{formatNumber(eftValue)}</TableCell>
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
                                                            <Select
                                                                options={clients.map((client, index) => ({
                                                                    value: client.name,
                                                                    label: client.name,
                                                                    key: index
                                                                }))}
                                                                onChange={(selectedOption) => setSelectedName(selectedOption?.value)}
                                                                // onChange={(selectedOption) => setSelectedName(selectedOption?.value)}
                                                                placeholder="Select client"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="">
                                                            <Input type="number" onChange={(e) => setValue(parseFloat(e.target.value))} />
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        }
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="default">
                                            <Link href="/cash-room/change-order?status=dispatched">More details</Link>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                        <TableCell >{formatNumber(cashInTransitEFTs.reduce((acc, record) => acc + (record.eftValue || 0), 0))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell >Outstanding payments</TableCell>
                        <TableCell><Dialog>
                            <DialogTrigger asChild>
                                <button className="text-blue-500 underline">Owing to customers
                                    <span> ({clientsPayable && clientsPayable.length})</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Owing to customers
                                        <span> ({clientsPayable && clientsPayable.length})</span>
                                    </DialogTitle>
                                    <DialogDescription>
                                        A list of outstanding payments to clients.
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
                                                {clientsPayable?.map(({ clientName, grandTotal }) => (
                                                    <TableRow key={clientName}>
                                                        <TableCell>{clientName}</TableCell>
                                                        <TableCell>{(formatNumber(grandTotal))}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="default">
                                        <Link href="/management/clients-payable?status=client+payable">More details</Link>
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog></TableCell>
                        <TableCell></TableCell>
                        <TableCell >{formatNumber(totalClientsPayable)}</TableCell>
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
                                                    <TableHead>Client</TableHead>
                                                    <TableHead>Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody >
                                                <TableRow>
                                                    <TableCell className=" w-1/2">
                                                        {/* <Select onValueChange={(e) => setSelectedName(e)}>
                                                            <SelectTrigger className="">
                                                                <SelectValue placeholder="Select client" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Clients</SelectLabel>
                                                                    {clients.map(({ name }) => (
                                                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select> */}
                                                        <Select
                                                            options={clients.map((client, index) => ({
                                                                value: client.name,
                                                                label: client.name,
                                                                key: index
                                                            }))}
                                                            onChange={(selectedOption) => setSelectedName(selectedOption?.value)}
                                                            placeholder="Select client"
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
                        <TableCell colSpan={3}><p className="text-lg font-semibold">TOTAL PAYABLE</p></TableCell>
                        <TableCell ><p className="text-lg font-semibold">{formatNumber(totalPayable)}</p></TableCell>

                    </TableRow>
                </TableBody>
            </Table >
        </div>
    )
}
