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
export default function CashOnHandSheet({ data }: { data: any }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <p className="underline cursor-pointer">More details</p>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <h1>Assets</h1>
                    <SheetTitle>Cash On Hand </SheetTitle>
                </SheetHeader>
                <section className="space-y-5">
                    <div>
                        <h2>Float </h2>
                        <div className="max-h-[80vh] overflow-auto">
                            {formatNumber(data?.cashOnHand?.float)}
                        </div>
                    </div>
                    <div>
                        <h2>Packed Cash ({data?.cashOnHand?.packedCash.packedCash && data?.cashOnHand?.packedCash.packedCash.length})</h2>
                        <div className="max-h-[30vh] overflow-auto">
                            <Table className="border-b-2 border-black">
                                <TableHeader>
                                    <TableHead>Index</TableHead>
                                    <TableHead>Bag ID</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableHeader>
                                <TableBody>
                                    {data?.cashOnHand?.packedCash.packedCash && data?.cashOnHand?.packedCash.packedCash.map((item: { clientName: string, grandTotal: number }, index: number) => {
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
                    </div>
                    <div>
                        <h2>Cash in transit ({data?.cashOnHand?.cashInTransit.dispatchedCash && data?.cashOnHand?.cashInTransit.dispatchedCash.length})</h2>
                        <div className="max-h-[30vh] overflow-auto">
                            <Table className="border-b-2 border-black">
                                <TableHeader>
                                    <TableHead>Index</TableHead>
                                    <TableHead>Bag ID</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableHeader>
                                <TableBody>
                                    {data?.cashOnHand?.cashInTransit.dispatchedCash && data?.cashOnHand?.cashInTransit.dispatchedCash.map((item: { clientName: string, grandTotal: number }, index: number) => {
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
                    </div>
                </section>
            </SheetContent>
        </Sheet>
    )
}
