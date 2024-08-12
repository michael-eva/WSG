'use client'
import { setBalanceSheetData } from "./utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Assets } from "./(Assets)/Assets";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import History from "./history";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/utils/utils";
import { Liabilities } from "./(Liabilities)/Liabilities";
import Discrepancy from "./Discrepancy";
import { getCountValueForDiscrepancy, getDiscrepancies } from "@/app/cash-room/utils";
type CashDetails = {
    packedCash: { clientName: string, grandTotal: number }[];
    total: { grandTotal: number, coinTotal: number, noteTotal: number };
};

type DispatchedCashDetails = {
    dispatchedCash: { clientName: string, grandTotal: number }[];
    total: number | null;
};

type OutstandingDetails = {
    outstandingDepositBags: { bagId: string, value: number }[];
    total: number | null;
};

type BankingDetails = {
    outstandingBanking: { clientName: string, grandTotal: number }[] | null;
    total: number | null;
};

type PaymentDetails = {
    outstandingPayments: { clientName: string, grandTotal: number }[] | null;
    total: number | null | undefined;
};
type AssetsForBalanceSheet = {
    bankAccount: number;
    cashOnHand: {
        float: number | undefined;
        packedCash: CashDetails;
        cashInTransit: DispatchedCashDetails;
    };
    outstandingDeposits: OutstandingDetails;
    outstandingBanking: BankingDetails;
    outstandingPayments: PaymentDetails;
    grandTotal: number;
    miscellaneous: {
        miscellaneous: {
            name: string, value: number
        },
        total: number | null
    }
};
type EFTDetails = {
    packedEFTs: { eftValue: number }[];
    total: number;
};

type MiscellaneousDetails = {
    miscellaneous: { description: string, value: number }[];
    total: number;
};

type LiabilitiesForBalanceSheet = {
    packedEFT: EFTDetails;
    notPackedEFT: EFTDetails;
    outstandingPayments: PaymentDetails;
    miscellaneous: MiscellaneousDetails;
    grandTotal: number
};

type DiscrepancyData = {
    id: number,
    clientName: string,
    grandTotal: number,
    countDiscrepancyReason?: string,
    guardDiscrepancyReason?: string,
    guardReturnValue?: number,
    countValue?: number,
    guard: string,
    deliveryDate: Date,
}
export default function BalanceSheet() {
    const [assets, setAssets] = useState<AssetsForBalanceSheet>()
    const [liabilities, setLiabilities] = useState<LiabilitiesForBalanceSheet>()
    const [bankCharges, setBankCharges] = useState<number>(0)
    const [discrepancyData, setDiscrepancyData] = useState<(DiscrepancyData & { countValue?: number })[]>([]);

    const subtotal = parseFloat(((assets?.grandTotal ?? 0) - (liabilities?.grandTotal ?? 0)).toFixed(2))
    const total = (subtotal + (bankCharges ?? 0)).toFixed(2);
    async function handleClick() {
        const balanceSheetData = {
            totalLiabilities: liabilities?.grandTotal,
            totalAssets: assets?.grandTotal,
            assets,
            liabilities,
            bankCharges,
            subtotal,
            balance: total
        }
        await setBalanceSheetData({ balanceSheetData });
        setBankCharges(0)
        window.location.reload()
    }
    useEffect(() => {
        const getData = async () => {
            const fetchedDiscrepancies = await getDiscrepancies();
            if (fetchedDiscrepancies) {

                if (fetchedDiscrepancies.length > 0) {
                    // Extract IDs from discrepancies
                    const ids = fetchedDiscrepancies.map((item) => item.id);

                    // Fetch cash counted data based on discrepancy IDs
                    const cashCountedData = await getCountValueForDiscrepancy(ids);

                    if (cashCountedData) {
                        // Combine discrepancies with cash counted data
                        const combinedData = fetchedDiscrepancies.map(discrepancy => {
                            const matchingCashCounted = cashCountedData.find((cashCounted) => cashCounted.changeOrderId === discrepancy.id);
                            return {
                                ...discrepancy,
                                countValue: matchingCashCounted ? matchingCashCounted.grandTotal : null
                            };
                        });
                        console.log("combined data:", combinedData);

                        // Update state with combined data
                        setDiscrepancyData(combinedData);
                    }
                }
            } else {
                setDiscrepancyData([]);
            }
        }
        getData()
    }, [])
    return (
        <div>
            <h1>Balance Sheet</h1>

            <div className="grid grid-cols-2 gap-4 text-left">
                <div >
                    <Assets setAssets={setAssets} />
                </div>
                <div className=" flex flex-col align-bottom justify-between">
                    <div>
                        <Liabilities setLiabilities={setLiabilities} />
                    </div>
                    <div className="bg-[#e5e7eb] rounded-md">
                        <div className=" p-2  flex justify-between ">
                            <div>
                                <h3>Bank Charges</h3>
                                <Label>Enter bank charges</Label>
                                <Input type="number" onChange={(e) => setBankCharges(parseFloat(e.target.value))} />
                            </div>
                            <div className="flex flex-col gap-8 pt-2 px-2  rounded-md items-end">
                                <div className="flex gap-4">
                                    <p className="font-bold">Subtotal:</p>
                                    <p className="font-bold">{formatNumber(subtotal)}</p>
                                </div>
                                <div className="flex gap-4">
                                    <h3>Balance:</h3>
                                    <h3>{formatNumber(total || 0)}</h3>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex justify-end p-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="default" className=" w-48">Save</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Please review the figures</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Once saved, this cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div>
                                        <div className="grid grid-cols-2">
                                            <div className=" mb-2">
                                                <p className="font-bold tracking-wider">Assets</p>
                                                <p>{formatNumber(assets?.grandTotal)}</p>
                                            </div>
                                            <div className=" mb-2">
                                                <p className="font-bold tracking-wider">Liabilities</p>
                                                <p>{formatNumber(liabilities?.grandTotal)}</p>
                                            </div>
                                            <div className=" mb-2">
                                                <p className="font-bold tracking-wider">Bank Charges</p>
                                                <p>{formatNumber(bankCharges)}</p>
                                            </div>
                                            <div className=" mb-2">
                                                <p className="font-bold tracking-wider">Subtotal</p>
                                                <p>{formatNumber(subtotal)}</p>
                                            </div>

                                            <div className="border-t col-span-2 border-b">
                                                <p className="font-bold tracking-wider text-lg mt-2">Balance</p>
                                                <p className="mb-2">{formatNumber(total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleClick()}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20">
                {discrepancyData && discrepancyData.length > 0 && <Discrepancy discrepancyData={discrepancyData} />}
            </div>
            <div className="mt-20">
                <History />
            </div>
        </div>
    )

}
