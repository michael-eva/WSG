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
export default function OutstandingDepositsSheet({ data }: { data: any }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <p className="underline cursor-pointer">More details</p>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <h1>Assets</h1>
                    <SheetTitle>Outstanding Desposits ({data?.outstandingDeposits?.outstandingDepositBags && data?.outstandingDeposits?.outstandingDepositBags.length})</SheetTitle>
                    <SheetDescription>
                        Payments yet to be received or counted from cash swaps.
                    </SheetDescription>
                </SheetHeader>
                <div className="max-h-[80vh] overflow-auto">
                    <Table className="border-b-2 border-black">
                        <TableHeader>
                            <TableHead>Index</TableHead>
                            <TableHead>Bag ID</TableHead>
                            <TableHead>Value</TableHead>
                        </TableHeader>
                        <TableBody>
                            {data?.outstandingDeposits?.outstandingDepositBags && data?.outstandingDeposits?.outstandingDepositBags.map((item: { bagId: string, value: number }, index: number) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item?.bagId}</TableCell>
                                        <TableCell>{formatNumber(item?.value)}</TableCell>
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
