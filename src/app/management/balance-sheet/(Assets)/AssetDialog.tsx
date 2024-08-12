import { formatNumber } from "@/utils/utils"
import { ReactNode } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import MiscSheet from "./(Sheets)/MiscSheet"
import OutstandingPaymentsSheet from "./(Sheets)/OutstandingPaymentsSheet"
import OutstandingBankingSheet from "./(Sheets)/OutstandingBankingSheet"
import OutstandingDepositsSheet from "./(Sheets)/OutstandingDepositsSheet"
import CashOnHandSheet from "./(Sheets)/CashOnHandSheet"


export default function AssetDialog({ data, date, time }: { data: any, date: ReactNode, time: ReactNode }) {
    return (
        <><h2 className="text-xl font-bold mb-4">Assets</h2>
            <p className="mb-4">Record of assets for <strong>{date}</strong> at <strong>{time}</strong></p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>View more</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-bold">Bank Account</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.bankAccount)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Cash on hand ({data?.cashOnHand?.packedCash.packedCash.length + data?.cashOnHand?.cashInTransit.dispatchedCash.length})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.cashOnHand.total)}</TableCell>
                        <TableCell className=" underline cursor-pointer"><CashOnHandSheet data={data} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Outstanding deposits ({data?.outstandingDeposits?.outstandingDepositBags.length})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.outstandingDeposits.total)}</TableCell>
                        <TableCell className=" underline cursor-pointer"><OutstandingDepositsSheet data={data} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Outstanding banking ({data.outstandingBanking.outstandingBanking && data?.outstandingBanking?.outstandingBanking.length})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.outstandingBanking.total)}</TableCell>
                        <TableCell className=" underline cursor-pointer"><OutstandingBankingSheet data={data} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Outstanding payments ({data?.outstandingPayments?.outstandingPayments.length})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.outstandingPayments.total)}</TableCell>
                        <TableCell className=" underline cursor-pointer"><OutstandingPaymentsSheet data={data} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Miscellaneous ({data?.miscellaneous?.miscellaneous.length})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.miscellaneous.total)}</TableCell>
                        <TableCell className=" ">
                            <MiscSheet data={data} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="flex justify-between px-4 mt-4 py-4 border-t">
                <h2>TOTAL ASSETS:</h2>
                <h2 className="mr-10">{formatNumber(data?.grandTotal)}</h2>
            </div>
        </>
    )
}
