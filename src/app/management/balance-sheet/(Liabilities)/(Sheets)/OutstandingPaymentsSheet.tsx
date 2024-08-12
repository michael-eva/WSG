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
export default function OutstandingPayments({ data }: { data: any }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <p className="underline cursor-pointer">More details</p>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <h1>Liabilities</h1>
                    <SheetTitle>Outstanding Payments ({data?.outstandingPayments?.outstandingPayments.length})</SheetTitle>
                    {/* <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription> */}
                </SheetHeader>
                <div className="max-h-[80vh] overflow-auto">
                    <Table className="border-b-2 border-black">
                        <TableHeader>
                            <TableHead>Index</TableHead>
                            <TableHead>Liability Name</TableHead>
                            <TableHead>Value</TableHead>
                        </TableHeader>
                        <TableBody>

                            {data?.outstandingPayments?.outstandingPayments.map((item: { clientName: string, grandTotal: number }, index: number) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item?.clientName}</TableCell>
                                        <TableCell>{formatNumber(item?.grandTotal)}</TableCell>
                                    </TableRow>
                                )
                            }
                            )}
                        </TableBody>
                    </Table>
                </div>
            </SheetContent>
        </Sheet>
    )
}
