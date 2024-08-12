'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/utils/supabaseClient";
import { formatNumber } from "@/utils/utils";
import { useEffect, useState } from "react";
import useDiscrepancyData from "./useDiscrepancyData";
import useCashOnHand from "./useFloatData";

export default function AuditInput() {
    const { cashOnHand, isLoading, error } = useCashOnHand();
    const noteIndex = ["50", "20", "10", "5"];
    const coinIndex = ["2", "1", "0.5", "0.2", "0.1", "0.05"];

    const [noteValues, setNoteValues] = useState<Record<string, string>>({});
    const [coinValues, setCoinValues] = useState<Record<string, string>>({});
    const [noteTotal, setNoteTotal] = useState(0);
    const [coinTotal, setCoinTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const discrepancy = grandTotal - (parseFloat(cashOnHand?.totalgrandtotal ?? '0') || 0)

    const handleNoteChange = (denomination: string, value: string) => {
        setNoteValues(prev => ({ ...prev, [denomination]: value }));
    };

    const handleCoinChange = (denomination: string, value: string) => {
        setCoinValues(prev => ({ ...prev, [denomination]: value }));
    };
    useEffect(() => {
        const calcNoteTotal = Object.entries(noteValues).reduce((acc, [denom, count]) => {
            return acc + ((parseFloat(count) || 0));
        }, 0);
        setNoteTotal(calcNoteTotal);

        const calcCoinTotal = Object.entries(coinValues).reduce((acc, [denom, count]) => {
            return acc + ((parseFloat(count) || 0));
        }, 0);
        setCoinTotal(calcCoinTotal);

        setGrandTotal(calcNoteTotal + calcCoinTotal);
    }, [noteValues, coinValues]);

    const handleSubmit = async () => {
        // Combine noteValues and coinValues
        const denominationValues = {
            ...noteValues,
            ...coinValues
        };

        // Prepare the data for insertion
        const insertData = {
            value: grandTotal,
            discrepancy: discrepancy, // You'll need to calculate this if needed
            'denomination-value': denominationValues
        };

        try {
            const { data, error } = await supabase
                .from('audit')
                .insert([insertData]);

            if (error) throw error;

            console.log('Data inserted successfully:', data);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    return (
        <div>
            <h1>Input Count</h1>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>Notes</TableHead>
                            <TableHead>Coins</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: Math.max(noteIndex.length, coinIndex.length) }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {noteIndex[index] && (
                                        <div className="flex gap-2 items-center">
                                            <p>${noteIndex[index]}</p>
                                            <Input
                                                type="number"
                                                value={noteValues[noteIndex[index]] || ""}
                                                onChange={(e) => handleNoteChange(noteIndex[index], e.target.value)}
                                                className="no-spinner"
                                            />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {coinIndex[index] && (
                                        <div className="flex gap-2 items-center">
                                            <p>${coinIndex[index]}</p>
                                            <Input
                                                type="number"
                                                value={coinValues[coinIndex[index]] || ""}
                                                onChange={(e) => handleCoinChange(coinIndex[index], e.target.value)}
                                                className="no-spinner"
                                            />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <div className="flex gap-4 justify-between">
                <div>
                    <div className="mt-4 w-64"> {/* Adjust width as needed */}
                        <div className="flex justify-between items-center border-b pb-1">
                            <p>Note Total:</p>
                            <p className="font-semibold">{formatNumber(noteTotal)}</p>
                        </div>
                        <div className="flex justify-between items-center border-b py-1">
                            <p>Coin Total:</p>
                            <p className="font-semibold">{formatNumber(coinTotal)}</p>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <p>Grand Total:</p>
                            <p className="font-semibold">{formatNumber(grandTotal)}</p>
                        </div>
                    </div>
                    <Button className="mt-4" onClick={handleSubmit}>Submit</Button>
                </div>
                <div>
                    <div className="flex justify-between mt-3 border-b p-1 w-64">
                        <p>Discrepancy:</p>
                        <p className={`font-semibold ${discrepancy !== 0 ? "text-red-500" : ""}`}>
                            {formatNumber(discrepancy)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}