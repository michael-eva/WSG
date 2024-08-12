'use client'

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { formatNumber, getDate } from "@/utils/utils"
import { Badge } from "@/components/ui/badge"
import { getBankingData, getDepositBagData, getTotalCashOnHand, getCountValueForDiscrepancy, getPendingChangeData, getDiscrepancies, updateDepositBagStatus, getCashOrderData, updateCashInputCashCountedStatus, updateChangeOrderCashCountedStatus, updateBankingCashCountStatus, updateBankingChangeOrderStatus, getClients } from "./utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PlaceOrder from "./change-order/place-order"
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getRuns } from "./change-order/utils"
import CashInput from "./cash-processing/(counting)/cash-input"
import { Dialog } from "@/components/Dialog"



type OrderData = {
    clientName: string;
    name?: string
    coinTotal: number;
    created_at: string;
    deliveryDate: string;
    pickupDate: string;
    fifty: number | null;
    fiftyC: number | null;
    five: number | null;
    fiveC: number | null;
    grandTotal: number;
    id: number;
    noteTotal: number;
    one: number | null;
    orderDate: string;
    run: string;
    status: "unprocessed" | "packed" | "dispatched" | "pending count";
    ten: number | null;
    tenC: number | null;
    twenty: number | null;
    twentyC: number | null;
    two: number | null;
    secondaryStatus: string | null;
};
type CashOnHand = {
    totalfifty: string;
    totaltwenty: string;
    totalten: string;
    totalfive: string;
    totaltwo: string;
    totalone: string;
    totalfiftyc: string;
    totaltwentyc: string;
    totaltenc: string;
    totalfivec: string;
    totalgrandtotal: string;
    totalcointotal: string;
    totalnotetotal: string;
}
type Discrepancy = {
    id: number;
    clientName: string;
    grandTotal: number;
    countDiscrepancyReason?: string;
    guardDiscrepancyReason?: string;
    guardReturnValue?: number;
    countValue?: number;
    guard: string;
}
type BankingData = {
    id: number;
    clientName: string;
    countDate: Date;
    bankDate: string;
    coinTotal: number;
    noteTotal: number;
    grandTotal: number;
    status: string
}
type DepositBagData = {
    id: number;
    value: number;
    bagId: string;
    status: string;
    created_at: Date;
    clientNames: string[]
    changeOrderIds: number[]
    cashCountIds: number[]
}

export default function Dashboard() {
    const [pendingChangeOrder, setPendingChangeOrder] = useState<OrderData[]>()
    const [cashOnHand, setCashOnHand] = useState<CashOnHand>()
    const [discrepancyData, setDiscrepancyData] = useState<(Discrepancy & { countValue?: number })[]>([]);
    const [bankingData, setBankingData] = useState<BankingData[]>();
    // const [depositBagData, setDepositBagData] = useState<DepositBagData[]>([]);
    const [outStandingCashOrders, setOutStandingCashOrders] = useState<OrderData[]>([]);
    const [clients, setClients] = useState<{ name: string, id: string }[] | null>([])
    const [runs, setRuns] = useState<{ name: string }[] | null>([])
    const [orderType, setOrderType] = useState<"cashOrder" | "changeOrder">();
    const [isCashProcessing, setIsCashProcessing] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const pendingOrders = pendingChangeOrder?.filter(order => order.status === 'unprocessed')
    const outstandingCashSwaps = pendingChangeOrder?.filter(order =>
        order.status === 'pending count' || order.status === 'dispatched'
    );
    const today = new Date().toLocaleDateString('en-AU');

    useEffect(() => {
        async function getData() {
            try {
                // Fetch pending change data
                const res: any = await getPendingChangeData();
                setPendingChangeOrder(res);
                // Fetch total cash on hand
                const cashOnHand: any = await getTotalCashOnHand();
                setCashOnHand(formattedCashOnHand(cashOnHand));
                const bankingData: any = await getBankingData();
                setBankingData(bankingData);
                // const depositBagData: any = await getDepositBagData();
                // setDepositBagData(depositBagData);
                const outStandingCashOrders: any = await getCashOrderData();
                setOutStandingCashOrders(outStandingCashOrders);
                // Fetch discrepancies
                const fetchedDiscrepancies = await getDiscrepancies();
                if (fetchedDiscrepancies) {

                    if (fetchedDiscrepancies.length > 0) {
                        // Extract IDs from discrepancies
                        const ids = fetchedDiscrepancies.map((item) => item.id);

                        // Fetch cash counted data based on discrepancy IDs
                        const cashCountedData = await getCountValueForDiscrepancy(ids);

                        if (cashCountedData) {
                            // Combine discrepancies with cash counted data
                            const combinedData = fetchedDiscrepancies.map(discrepancy => {
                                const matchingCashCounted = cashCountedData.find((cashCounted) => cashCounted.changeOrderId === discrepancy.id);
                                return {
                                    ...discrepancy,
                                    countValue: matchingCashCounted ? matchingCashCounted.grandTotal : null
                                };
                            });
                            console.log("combined data:", combinedData);

                            // Update state with combined data
                            setDiscrepancyData(combinedData);
                        }
                    }
                } else {
                    setDiscrepancyData([]);
                }
                const clients = await getClients()
                setClients(clients)
                const runs = await getRuns()
                setRuns(runs)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        getData();
    }, []);


    function formattedCashOnHand(cashOnHand: CashOnHand) {
        return {
            totalfifty: formatNumber(cashOnHand.totalfifty),
            totaltwenty: formatNumber(cashOnHand.totaltwenty),
            totalten: formatNumber(cashOnHand.totalten),
            totalfive: formatNumber(cashOnHand.totalfive),
            totaltwo: formatNumber(cashOnHand.totaltwo),
            totalone: formatNumber(cashOnHand.totalone),
            totalfiftyc: formatNumber(cashOnHand.totalfiftyc),
            totaltwentyc: formatNumber(cashOnHand.totaltwentyc),
            totaltenc: formatNumber(cashOnHand.totaltenc),
            totalfivec: formatNumber(cashOnHand.totalfivec),
            totalgrandtotal: formatNumber(cashOnHand.totalgrandtotal),
            totalcointotal: formatNumber(cashOnHand.totalcointotal),
            totalnotetotal: formatNumber(cashOnHand.totalnotetotal)
        }
    }

    // function handleStatusChange(value: string, id: string) {
    //     const item = depositBagData.find(item => item.bagId === id);
    //     const changeOrderIds = item!.changeOrderIds;
    //     const cashCountIds = item!.cashCountIds;

    //     updateDepositBagStatus(id)
    //     updateBankingCashCountStatus(cashCountIds)
    //     updateBankingChangeOrderStatus(changeOrderIds)
    //     updateChangeOrderCashCountedStatus(changeOrderIds)
    //     updateCashInputCashCountedStatus(cashCountIds)


    // }

    return (
        <div className="flex justify-center">

            <div className="grid grid-cols-3 gap-6">
                <div className=" col-span-full flex justify-between">
                    <Card>
                        <CardHeader>
                            <div className="flex gap-4 justify-evenly">
                                <Button variant={"outline"} className="" onClick={() => { setIsOpen(!isOpen), setOrderType("changeOrder") }} >Enter Change Order</Button>
                                <Button variant={"outline"} className="" onClick={() => { setIsOpen(!isOpen), setOrderType("cashOrder") }}>Place Cash Order</Button>
                                <Button variant={"outline"} className="" onClick={() => { setIsOpen(!isOpen), setIsCashProcessing(!isCashProcessing) }}>Enter Cash Processing</Button>
                                {/* <Button variant={"outline"} className="" onClick={() => { setIsOpen(!isOpen), setOrderType("cashOrder") }}>Enter Parking Tins</Button> */}
                            </div>
                        </CardHeader>
                    </Card>
                    <div className="flex flex-col">
                        <Card>
                            <CardHeader>
                                <div className="flex gap-2">
                                    <div className="text-2xl font-bold">{pendingOrders?.filter(order => order?.deliveryDate === today).length || 0}</div>
                                    <div className="text-2xl font-bold mr-4">Orders Due Today</div>
                                    <Button size="sm" onClick={() => window.location.href = `/cash-room/change-order/?date=${today}`}>View Orders</Button>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
                {(outstandingCashSwaps && outstandingCashSwaps.length > 0 || outStandingCashOrders && outStandingCashOrders.length > 0) &&
                    <Card className="col-span-3 max-h-[400px] overflow-y-auto flex flex-col">
                        <CardHeader>
                            <CardTitle>Outstanding Cash Swaps</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Outstanding</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {outstandingCashSwaps && outstandingCashSwaps.length > 0 && outstandingCashSwaps?.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{order.deliveryDate}</TableCell>
                                            <TableCell>{order.clientName}</TableCell>
                                            <TableCell>{formatNumber(order.grandTotal)}</TableCell>
                                            <TableCell className="flex text-xs space-x-1">
                                                <Badge className={`text-xs ${order.status === "unprocessed" && "bg-teal-400"} ${order.status === "pending count" && "bg-fuchsia-500"}`}>{order.status}</Badge>

                                                {order?.secondaryStatus && <Badge className="border-red-500 bg-red-500 text-white border">
                                                    {order.secondaryStatus === "guard discrepancy" && "discrepancy"}
                                                </Badge>}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => window.location.href = `/cash-room/cash-processing/change-order/${order.id}`}
                                                    disabled={order.status != "pending count"}
                                                >Input Value</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    }
                                    {outStandingCashOrders && outStandingCashOrders.length > 0 && outStandingCashOrders?.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{order.pickupDate}</TableCell>
                                            <TableCell>{order.name}</TableCell>
                                            <TableCell>${order.grandTotal}</TableCell>
                                            <TableCell className="flex gap-2 text-xs">
                                                <div className={`border px-2 py-1 rounded-lg text-center${order.status === 'unprocessed' ? " text-purple-950 bg-fuchsia-300 border-fuchsia-300" : " text-blue-950 bg-blue-300 border-blue-300"}`}>
                                                    {order.status}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => window.location.href = `/cash-room/cash-processing/cash-order/${order.id}`}
                                                // disabled={order.status != "pending count"}
                                                >Input Value</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>}


                <div className="flex col-span-full gap-6">
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Coin Bin Collection</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4">
                            <div>
                                <p>$50.00</p>
                            </div>
                            <div>
                                <p>10</p>
                            </div>
                            <div>
                                <Button size="sm">Submit</Button>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Float Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold">{cashOnHand?.totalfifty}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totaltwenty}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totalten}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totalfive}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totaltwo}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totalone}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totalfiftyc}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totaltwentyc}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totaltenc}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totalfivec}</TableCell>
                                    <TableCell className="font-bold">{cashOnHand?.totalgrandtotal}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {discrepancyData && discrepancyData.length > 0 &&
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Discrepancies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Expected Value</TableHead>
                                        <TableHead>Count Value</TableHead>
                                        <TableHead>Guard Returned Value</TableHead>
                                        <TableHead>Guard Reason</TableHead>
                                        <TableHead>Count Reason</TableHead>
                                        <TableHead>Guard Name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {discrepancyData?.map((item, id) => (
                                        <TableRow key={id}>
                                            <TableCell>{item?.clientName}</TableCell>
                                            <TableCell>Change Order / Cash Swap</TableCell>
                                            <TableCell>${item?.grandTotal}</TableCell>
                                            <TableCell>{item?.countValue ? `$${item?.countValue}` : <Badge className="bg-orange-500">Pending</Badge>}</TableCell>
                                            <TableCell>${item?.guardReturnValue}</TableCell>
                                            <TableCell>{item?.guardDiscrepancyReason ? item.guardDiscrepancyReason : <Badge className=" bg-teal-500">N/A</Badge>}</TableCell>
                                            <TableCell>{item?.countDiscrepancyReason ? item?.countDiscrepancyReason : <Badge className="bg-orange-500">Pending</Badge>}</TableCell>
                                            <TableCell>{item?.guard}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                }
                {bankingData && bankingData.length > 0 &&
                    <Card className="col-span-3">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Outstanding Banking</CardTitle>
                                <Button
                                    onClick={() => window.location.href = `/cash-room/banking?awaitingBanking-status=awaiting+banking&bankingHistory-status=pending`}
                                >View More</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-[400px] overflow-y-auto">
                            <Table >
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client Name</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Coin Total</TableHead>
                                        <TableHead>Note Total</TableHead>
                                        <TableHead>Grand Total</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    {bankingData?.map((item, id) => (
                                        <TableRow key={id}>
                                            <TableCell>{item?.clientName}</TableCell>
                                            <TableCell>{getDate(item?.countDate)}</TableCell>
                                            <TableCell>{item?.coinTotal ? `$${item?.coinTotal}` : "-"}</TableCell>
                                            <TableCell>${item?.noteTotal}</TableCell>
                                            <TableCell>${item?.grandTotal}</TableCell>
                                            <TableCell><Badge className="bg-purple-500">{item?.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </CardContent>
                    </Card>
                }
                {/* {depositBagData && depositBagData.length > 0 && (
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Outstanding Deposits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Bag Number</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {depositBagData?.map((item, id) => (
                                        <TableRow key={id}>
                                            <TableCell></TableCell>
                                            <TableCell>${item?.value}</TableCell>
                                            <TableCell>{item?.bagId}</TableCell>
                                            <TableCell>
                                                <Select onValueChange={(e) => handleStatusChange(e, item.bagId)} defaultValue={item?.status} >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="awaiting deposit">Awaiting Deposit</SelectItem>
                                                        <SelectItem value="deposited">Deposited</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-end">
                                <Button onClick={() => window.location.href = `/cash-room/banking?awaitingBanking-status=awaiting+banking&bankingHistory-status=awaiting+deposit`}>View Outstanding Deposits</Button>
                            </div>
                        </CardContent>
                    </Card>
                )
                } */}
            </div>
            {isOpen && <Dialog setIsOpen={setIsOpen} setIsCashProcessing={setIsCashProcessing}>
                {!isCashProcessing ? <PlaceOrder type={orderType} clients={clients} runs={runs} />
                    :
                    <CashInput />
                }
            </Dialog>}

        </div>
    )
}
// function Dialog({ setIsOpen, children, setIsCashProcessing }: { setIsOpen: any, children: any, setIsCashProcessing: any }) {
//     const closeDialog = () => { setIsOpen(false), setIsCashProcessing(false) };
//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">

//             <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[60vw] max-h-[100vh] overflow-auto">
//                 <div className="flex justify-end">
//                     <div
//                         onClick={closeDialog}
//                         className="px-2 border rounded border-transparent cursor-pointer hover:border-gray-500"
//                     >
//                         X
//                     </div>
//                 </div>
//                 <div className="min-h-[80vh]">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     )
// }