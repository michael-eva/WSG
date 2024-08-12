import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { formatNumber } from "@/utils/utils"
export default function OutstandingBankingSheet({ data }: { data: any }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <p className="underline cursor-pointer">More details</p>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <h1>Assets</h1>
                    <SheetTitle>Outstanding Banking ({data.outstandingBanking.outstandingBanking && data?.outstandingBanking?.outstandingBanking.length})</SheetTitle>
                    <SheetDescription>
                        Cash yet to be banked.
                    </SheetDescription>
                </SheetHeader>
                <div className="max-h-[80vh] overflow-auto">
                    <Table className="border-b-2 border-black">
                        <TableHeader>
                            <TableHead>Index</TableHead>
                            <TableHead>Asset Name</TableHead>
                            <TableHead>Value</TableHead>
                        </TableHeader>
                        <TableBody>
                            {data?.outstandingBanking?.outstandingBanking && data?.outstandingBanking?.outstandingBanking.map((item: { clientName: string, grandTotal: number }, index: number) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item?.clientName}</TableCell>
                                        <TableCell>{formatNumber(item?.grandTotal)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </SheetContent>
        </Sheet>
    )
}
