'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { formatNumber } from "@/utils/utils";
import useCashOnHand, { CashOnHand } from "./useFloatData";

export default function Float() {
    const { cashOnHand, isLoading, error } = useCashOnHand();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!cashOnHand) return <div>No data available</div>;

    return (
        <div className="w-[985px]">
            <Card className="">
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
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totalfifty)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totaltwenty)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totalten)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totalfive)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totaltwo)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totalone)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totalfiftyc)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totaltwentyc)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totaltenc)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totalfivec)}</TableCell>
                                <TableCell className="font-bold">{formatNumber(cashOnHand.totalgrandtotal)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}