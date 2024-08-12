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
export default function OutstandingOrdersSheet({ data }: { data: any }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <p className="underline cursor-pointer">More details</p>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <h1>Liabilities</h1>
                    <SheetTitle>Outstanding Orders </SheetTitle>
                </SheetHeader>
                <section className="space-y-5">
                    <div>
                        <h2>Packed (EFT's) ({data?.outstandingOrders?.packedEFT?.packedEFT && data?.outstandingOrders?.packedEFT?.packedEFT?.length || 0})</h2>
                        <div className="max-h-[30vh] overflow-auto">
                            <Table className="border-b-2 border-black">
                                <TableHeader>
                                    <TableHead>Index</TableHead>
                                    <TableHead>Liability Name</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableHeader>
                                <TableBody>
                                    {data?.outstandingOrders?.packedEFT?.packedEFT && data?.outstandingOrders?.packedEFT?.packedEFT.map((item: { clientName: string, eftValue: number }, index: number) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item?.clientName}</TableCell>
                                                <TableCell>{formatNumber(item?.eftValue)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div>
                        <h2>Not Packed (EFT's) ({data?.outstandingOrders?.notPackedEFT?.notPackedEFTs && data?.outstandingOrders?.notPackedEFT?.notPackedEFTs.length})</h2>
                        <div className="max-h-[30vh] overflow-auto">
                            <Table className="border-b-2 border-black">
                                <TableHeader>
                                    <TableHead>Index</TableHead>
                                    <TableHead>Bag ID</TableHead>
                                    <TableHead>Asset Value</TableHead>
                                </TableHeader>
                                <TableBody>
                                    {data?.outstandingOrders?.notPackedEFT?.notPackedEFTs && data?.outstandingOrders?.notPackedEFT?.notPackedEFTs.map((item: { clientName: string, eftValue: number }, index: number) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item?.clientName}</TableCell>
                                                <TableCell>{formatNumber(item?.eftValue)}</TableCell>
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
