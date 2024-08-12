import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/utils/utils";
import { ReactNode } from "react";
import OutstandingOrdersSheet from "./(Sheets)/OutstandingOrdersSheet";
import OutstandingPayments from "./(Sheets)/OutstandingPaymentsSheet";
import MiscSheet from "./(Sheets)/MiscSheet";
export default function LiabilityDialog({ date, time, data }: { data: any, time: ReactNode, date: ReactNode }) {
    return (
        <><h2 className="text-xl font-bold mb-4">Liabilities</h2>
            <p className="mb-4">Record of assets for <strong>{date}</strong> at <strong>{time}</strong></p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Liability</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>View more</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-bold">Outstanding orders ({data?.outstandingOrders?.notPackedEFT?.notPackedEFTs.length + (data?.outstandingOrders?.packedEFT?.packedEFT?.length || 0)})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.outstandingOrders.total)}</TableCell>
                        <TableCell className=" underline cursor-pointer"><OutstandingOrdersSheet data={data} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Outstanding payments ({data?.outstandingPayments?.outstandingPayments.length})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.outstandingPayments.total)}</TableCell>
                        <TableCell className=" underline cursor-pointer"><OutstandingPayments data={data} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Miscellaneous ({data?.miscellaneous?.miscellaneous.length})</TableCell>
                        <TableCell className="font-bold">{formatNumber(data?.miscellaneous.total)}</TableCell>
                        <TableCell className=" underline cursor-pointer"><MiscSheet data={data} /></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="flex justify-between px-4 mt-4 py-4 border-t">
                <h2>TOTAL LIABILITIES:</h2>
                <h2 className="mr-10">{formatNumber(data?.grandTotal)}</h2>
            </div>
        </>
    )
}
