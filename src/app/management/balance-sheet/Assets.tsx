// import { getTotalCashOnHand, getPackedCashData, getBankingData, getDepositBagData, getUnverifiedClientReimbursements, getInTransitCashData } from "./utils";
// import { useEffect, useState } from "react";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area"
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// type CashOnHand = {
//     totalfifty: number;
//     totaltwenty: number;
//     totalten: number;
//     totalfive: number;
//     totaltwo: number;
//     totalone: number;
//     totalfiftyc: number;
//     totaltwentyc: number;
//     totaltenc: number;
//     totalfivec: number;
//     totalgrandtotal: number;
//     totalcointotal: number;
//     totalnotetotal: number;
// }
// type PendingCashSwap = {
//     clientName: string;
//     grandTotal: number;
// }
// export function Assets({ getAssets }: any) {
//     const [cashOnHand, setCashOnHand] = useState<CashOnHand | null>(null)
//     const [bankBalance, setBankBalance] = useState<number>(0)
//     const [packedCashValue, setPackedCashValue] = useState({ grandTotal: 0, coinTotal: 0, noteTotal: 0 })
//     const [packedCash, setPackedCash] = useState<{ clientName: string, grandTotal: number }[]>([])
//     const [outstandingBankingValue, setOutstandingBankingValue] = useState<number | null>(0)
//     const [outstandingBanking, setOutstandingBanking] = useState<{ clientName: string, grandTotal: number }[] | null>(null)
//     const [outstandingDepositBags, setOutstandingDepositBags] = useState<{ value: number, bagId: string }[]>([])
//     const [outstandingDepositBagValue, setOutstandingDepositBagValue] = useState<number | null>(0)
//     const [dispatchedCashValue, setDispatchedCashValue] = useState<number | null>(0)
//     const [dispatchedCash, setDispatchedCash] = useState<{ clientName: string, grandTotal: number }[]>([])
//     const [unverifiedClientReimbursementTotal, setUnverifiedClientReimbursementTotal] = useState<number | null | undefined>(0)
//     const [pendingCashSwap, setPendingCashSwap] = useState<PendingCashSwap[] | null>(null)
//     useEffect(() => {
//         //@ts-ignore
//         getTotalCashOnHand().then((data) => setCashOnHand(data))
//         getPackedCashData().then(({ grandTotal, coinTotal, noteTotal, packedCash }) => {
//             setPackedCashValue({ grandTotal, coinTotal, noteTotal });
//             setPackedCash(packedCash);
//         })
//         getBankingData()
//             .then(({ outstandingBankingValue, outstandingBanking }) => {
//                 setOutstandingBankingValue(outstandingBankingValue);
//                 setOutstandingBanking(outstandingBanking);

//             })
//         getDepositBagData()
//             .then(({ outstandingDepositBagValue, outstandingDepositBags }) => {
//                 setOutstandingDepositBagValue(outstandingDepositBagValue);
//                 setOutstandingDepositBags(outstandingDepositBags);
//             })
//         getUnverifiedClientReimbursements()
//             .then(({ totalUnverifiedClientReimbursements, pendingCashSwap }) => {
//                 setUnverifiedClientReimbursementTotal(totalUnverifiedClientReimbursements);
//                 setPendingCashSwap(pendingCashSwap);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//         getInTransitCashData()
//             .then(({ dispatchedCash, totalGrandTotal }) => {
//                 setDispatchedCashValue(totalGrandTotal)
//                 setDispatchedCash(dispatchedCash)
//             })
//     }, [])

//     const cashOnHandTotal = (cashOnHand?.totalgrandtotal ?? 0) + packedCashValue.grandTotal + (dispatchedCashValue ?? 0);
//     const totalOutstandingDeposits = (outstandingDepositBagValue ?? 0) + (outstandingBankingValue ?? 0)
//     const totalOutstandingPayments = unverifiedClientReimbursementTotal
//     const totalCash = cashOnHandTotal + totalOutstandingDeposits + bankBalance + (totalOutstandingPayments ?? 0) + (outstandingBankingValue ?? 0);
//     // console.log("total cash:", totalCash);


//     getAssets(totalCash)
//     return (
//         <div className="border rounded-lg">
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead colSpan={4} className=" text-center text-lg bg-gray-200">Assets</TableHead>
//                     </TableRow>
//                     <TableRow>
//                         <TableHead >Asset</TableHead>
//                         <TableHead>Breakdown</TableHead>
//                         <TableHead>Value</TableHead>
//                         <TableHead>Total</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     <TableRow>
//                         <TableCell className="">Bank Account</TableCell>
//                         <TableCell></TableCell>
//                         <TableCell>
//                             <Input type="number" value={bankBalance || ""} onChange={(e) => setBankBalance(Number(e.target.value))} className=" w-32" />
//                         </TableCell>
//                         <TableCell className="">${bankBalance}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                         <TableCell rowSpan={3} className="">Cash on hand</TableCell>
//                         <TableCell>
//                             <Dialog>
//                                 <DialogTrigger asChild>
//                                     <button className="text-blue-500 underline">Float
//                                     </button>
//                                 </DialogTrigger>
//                                 <DialogContent>
//                                     <DialogHeader>
//                                         <DialogTitle>Float
//                                         </DialogTitle>
//                                         <DialogDescription>
//                                             Float balances.
//                                         </DialogDescription>
//                                         <ScrollArea className="max-h-48">
//                                             <Table>
//                                                 <TableHeader>
//                                                     <TableRow>
//                                                         <TableHead>$50</TableHead>
//                                                         <TableHead>$20</TableHead>
//                                                         <TableHead>$10</TableHead>
//                                                         <TableHead>$5</TableHead>
//                                                         <TableHead>$2</TableHead>
//                                                         <TableHead>$1</TableHead>
//                                                         <TableHead>50c</TableHead>
//                                                         <TableHead>20c</TableHead>
//                                                         <TableHead>10c</TableHead>
//                                                         <TableHead>5c</TableHead>
//                                                         {/* <TableHead>Total</TableHead> */}
//                                                     </TableRow>
//                                                 </TableHeader>
//                                                 <TableBody>
//                                                     <TableRow>
//                                                         <TableCell>${cashOnHand?.totalfifty}</TableCell>
//                                                         <TableCell>${cashOnHand?.totaltwenty}</TableCell>
//                                                         <TableCell>${cashOnHand?.totalten}</TableCell>
//                                                         <TableCell>${cashOnHand?.totalfive}</TableCell>
//                                                         <TableCell>${cashOnHand?.totaltwo}</TableCell>
//                                                         <TableCell>${cashOnHand?.totalone}</TableCell>
//                                                         <TableCell>${cashOnHand?.totalfiftyc}</TableCell>
//                                                         <TableCell>${cashOnHand?.totaltwentyc}</TableCell>
//                                                         <TableCell>${cashOnHand?.totaltenc}</TableCell>
//                                                         <TableCell>${cashOnHand?.totalfivec}</TableCell>
//                                                         {/* <TableCell>${cashOnHand?.totalgrandtotal}</TableCell> */}
//                                                     </TableRow>
//                                                 </TableBody>
//                                             </Table>
//                                             <div className="flex gap-3 items-center">
//                                                 <div className="font-semibold text-md">Total float:</div>
//                                                 <div className="font-bold">
//                                                     ${cashOnHand?.totalgrandtotal}
//                                                 </div>
//                                             </div>
//                                         </ScrollArea>
//                                     </DialogHeader>
//                                 </DialogContent>
//                             </Dialog></TableCell>
//                         <TableCell >{cashOnHand?.totalgrandtotal}</TableCell>
//                         <TableCell rowSpan={3} className="">${cashOnHandTotal}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                         <TableCell>
//                             <Dialog>
//                                 <DialogTrigger asChild>
//                                     <button className="text-blue-500 underline ">Packed cash
//                                         <span> ({packedCash && packedCash.length})</span>
//                                     </button>
//                                 </DialogTrigger>
//                                 <DialogContent className="sm:max-w-[425px]">
//                                     <DialogHeader>
//                                         <DialogTitle>Packed cash
//                                             <span> ({packedCash && packedCash.length})</span>
//                                         </DialogTitle>
//                                         <DialogDescription>
//                                             A list of packed cash.
//                                         </DialogDescription>
//                                         <ScrollArea className="max-h-48 ">
//                                             <Table>
//                                                 <TableHeader>
//                                                     <TableRow>
//                                                         <TableHead>Bag Id</TableHead>
//                                                         <TableHead>Value</TableHead>
//                                                     </TableRow>
//                                                 </TableHeader>
//                                                 <TableBody>
//                                                     {packedCash?.map(({ clientName, grandTotal }) => (
//                                                         <TableRow key={clientName}>
//                                                             <TableCell>{clientName}</TableCell>
//                                                             <TableCell>{grandTotal}</TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </ScrollArea>
//                                     </DialogHeader>
//                                 </DialogContent>
//                             </Dialog></TableCell>
//                         <TableCell >{packedCashValue.grandTotal}</TableCell>

//                     </TableRow>
//                     <TableRow>
//                         <TableCell><Dialog>
//                             <DialogTrigger asChild>
//                                 <button className="text-blue-500 underline ">Cash in transit
//                                     <span> ({dispatchedCash && dispatchedCash.length})</span>
//                                 </button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                                 <DialogHeader>
//                                     <DialogTitle>Cash in transit
//                                         <span> ({dispatchedCash && dispatchedCash.length})</span>
//                                     </DialogTitle>
//                                     <DialogDescription>
//                                         A list of cash in transit.
//                                     </DialogDescription>
//                                     <ScrollArea className="max-h-48 ">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Bag Id</TableHead>
//                                                     <TableHead>Value</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {dispatchedCash?.map(({ clientName, grandTotal }) => (
//                                                     <TableRow key={clientName}>
//                                                         <TableCell>{clientName}</TableCell>
//                                                         <TableCell>{grandTotal}</TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </ScrollArea>
//                                 </DialogHeader>
//                             </DialogContent>
//                         </Dialog></TableCell>
//                         <TableCell >{dispatchedCashValue}</TableCell>

//                     </TableRow>
//                     <TableRow>
//                         <TableCell className="">
//                             Outstanding deposits</TableCell>
//                         <TableCell>
//                             <Dialog>
//                                 <DialogTrigger asChild>
//                                     <button className="text-blue-500 underline ">Outstanding deposits
//                                         <span> ({outstandingDepositBags && outstandingDepositBags.length})</span>
//                                     </button>
//                                 </DialogTrigger>
//                                 <DialogContent className="sm:max-w-[425px]">
//                                     <DialogHeader>
//                                         <DialogTitle>Outstanding deposits
//                                             <span> ({outstandingDepositBags && outstandingDepositBags.length})</span>
//                                         </DialogTitle>
//                                         <DialogDescription>
//                                             A list of deposit bags which are yet to be receipted in bank account.
//                                         </DialogDescription>
//                                         <ScrollArea className="max-h-48 ">
//                                             <Table>
//                                                 <TableHeader>
//                                                     <TableRow>
//                                                         <TableHead>Bag Id</TableHead>
//                                                         <TableHead>Value</TableHead>
//                                                     </TableRow>
//                                                 </TableHeader>
//                                                 <TableBody>
//                                                     {outstandingDepositBags?.map(({ bagId, value }) => (
//                                                         <TableRow key={bagId}>
//                                                             <TableCell>{bagId}</TableCell>
//                                                             <TableCell>{value}</TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </ScrollArea>
//                                     </DialogHeader>
//                                     <DialogFooter>
//                                         <Button variant="default">
//                                             <Link href="/management/banking">More details</Link>
//                                         </Button>
//                                     </DialogFooter>
//                                 </DialogContent>
//                             </Dialog>
//                         </TableCell>
//                         <TableCell ></TableCell>
//                         <TableCell className="">{totalOutstandingDeposits}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                         <TableCell className="flex items-center ">
//                             Oustanding banking
//                         </TableCell>
//                         <TableCell >
//                             <Dialog>
//                                 <DialogTrigger asChild>
//                                     <button className="text-blue-500 underline ">Outstanding banking
//                                         <span> ({outstandingBanking && outstandingBanking.length})</span>
//                                     </button>
//                                 </DialogTrigger>
//                                 <DialogContent className="sm:max-w-[425px]">
//                                     <DialogHeader>
//                                         <DialogTitle>Outstanding banking
//                                             <span> ({outstandingBanking && outstandingBanking.length})</span>
//                                         </DialogTitle>
//                                         <DialogDescription>
//                                             A list of cash which has been counted but yet to be banked.
//                                         </DialogDescription>
//                                         <ScrollArea className="max-h-48 ">
//                                             <Table>
//                                                 <TableHeader>
//                                                     <TableRow>
//                                                         <TableHead>Client</TableHead>
//                                                         <TableHead>Value</TableHead>
//                                                     </TableRow>
//                                                 </TableHeader>
//                                                 <TableBody>
//                                                     {outstandingBanking?.map(({ clientName, grandTotal }) => (
//                                                         <TableRow key={clientName}>
//                                                             <TableCell>{clientName}</TableCell>
//                                                             <TableCell>{grandTotal}</TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </ScrollArea>
//                                     </DialogHeader>
//                                     <DialogFooter>
//                                         <Button variant="default">
//                                             <Link href="/management/banking">More details</Link>
//                                         </Button>
//                                     </DialogFooter>
//                                 </DialogContent>
//                             </Dialog>
//                         </TableCell>
//                         <TableCell ></TableCell>
//                         <TableCell className="">{outstandingBankingValue}</TableCell>
//                     </TableRow>
//                     <TableRow >
//                         <TableCell className="">Outstanding payments</TableCell>
//                         <TableCell>
//                             <Dialog>
//                                 <DialogTrigger asChild>
//                                     <button className="text-blue-500 underline ">Unverified client reimbursement
//                                         <span> ({pendingCashSwap && pendingCashSwap.length})</span>
//                                     </button>
//                                 </DialogTrigger>
//                                 <DialogContent className="sm:max-w-[425px]">
//                                     <DialogHeader>
//                                         <DialogTitle>Unverified client reimbursement
//                                             <span> ({pendingCashSwap && pendingCashSwap.length})</span>
//                                         </DialogTitle>
//                                         <DialogDescription>
//                                             A list of all the cash swaps received which have yet to be counted.
//                                         </DialogDescription>

//                                         <ScrollArea className="max-h-48 ">
//                                             <Table>
//                                                 <TableHeader>
//                                                     <TableRow>
//                                                         <TableHead>Client</TableHead>
//                                                         <TableHead>Value</TableHead>
//                                                     </TableRow>
//                                                 </TableHeader>
//                                                 <TableBody>
//                                                     {pendingCashSwap?.map(({ clientName, grandTotal }) => (
//                                                         <TableRow key={clientName}>
//                                                             <TableCell>{clientName}</TableCell>
//                                                             <TableCell>{grandTotal}</TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </ScrollArea>
//                                     </DialogHeader>
//                                 </DialogContent>
//                             </Dialog>
//                         </TableCell>
//                         <TableCell />
//                         <TableCell className="">{totalOutstandingPayments}</TableCell>
//                     </TableRow>
//                     <TableRow className="bg-gray-200">
//                         <TableCell colSpan={3}><p className="text-lg font-semibold">TOTAL CASH AVAILABLE</p></TableCell>
//                         <TableCell ><p className="text-lg font-semibold">{totalCash}</p></TableCell>
//                     </TableRow>
//                 </TableBody>
//             </Table >
//         </div>
//     )
// }