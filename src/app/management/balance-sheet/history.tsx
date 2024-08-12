'use client'

import { ReactNode, useEffect, useState } from "react"
import { getBalanceSheetHistory } from "./utils"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDate, getTime, formatNumber } from "@/utils/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import AssetDialog from "./(Assets)/AssetDialog";
import LiabilityDialog from "./(Liabilities)/LiabilityDialog";
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

type Assets = {
    cashOnHand: {
        float: number | undefined;
        packedCash: CashDetails;
        cashInTransit: DispatchedCashDetails;
    };
    grandTotal: number;
    bankAccount: number;
    outstandingBanking: BankingDetails;
    outstandingDeposits: OutstandingDetails;
    outstandingPayments: PaymentDetails;
};

type Liabilities = {
    packedEFT: { eftValue: number }[];
    grandTotal: number;
    notPackedEFT: { eftValue: number }[];
    miscellaneous: { description: string, value: number }[];
    outstandingPayments: PaymentDetails;
};

type BalanceSheetData = {
    assets: Assets;
    balance: number;
    bankCharges: number;
    created_at: Date;
    id: number;
    liabilities: Liabilities;
    status: string | null;
    subtotal: number;
    totalAssets: number;
    totalLiabilities: number;
};
export default function History() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [history, setHistory] = useState<BalanceSheetData[] | null>([])
    const [data, setData] = useState<any>(null)
    useEffect(() => {
        async function getData() {
            const data = await getBalanceSheetHistory()
            setHistory(data)

        }
        getData()
    }, [])
    console.log(history);

    function handleRowClick(data: any, type: "assets" | "liabilities", date: ReactNode, time: ReactNode) {
        setIsOpen(true)
        console.log(data);

        const assetData = () => {
            return (
                <AssetDialog data={data} date={date} time={time} />
            )
        }
        const liabilityData = () => {
            return (
                <LiabilityDialog data={data} date={date} time={time} />

            )
        }
        setData(type === "assets" ? assetData : liabilityData)
    }
    return (
        <>
            <h1>History</h1>
            <div className="">
                <div className="bg-white rounded-lg shadow-md overflow-x-auto ">
                    <div className=" max-h-80 overflow-y-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-100 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Assets</th>
                                    <th className="px-4 py-3">Liabilites</th>
                                    <th className="px-4 py-3">Bank Charges</th>
                                    <th className="px-4 py-3">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {history && history?.length > 0 ? history.map((item, index) => (

                                    <tr key={index}>
                                        <td className="px-4 py-3 text-center" >{getDate(item?.created_at)}</td>
                                        <td className="px-4 py-3 text-center cursor-pointer underline" onClick={() => handleRowClick(item?.assets, "assets", getDate(item?.created_at), getTime(item?.created_at))}>{formatNumber(item?.assets?.grandTotal.toString())}</td>
                                        <td className="px-4 py-3 text-center cursor-pointer underline" onClick={() => handleRowClick(item?.liabilities, "liabilities", getDate(item?.created_at), getTime(item?.created_at))}>{formatNumber((item?.liabilities?.grandTotal.toFixed(2)))}</td>
                                        <td className="px-4 py-3 text-center">{formatNumber(item?.bankCharges)}</td>
                                        <td className="px-4 py-3 text-center">{formatNumber(item?.balance)}</td>
                                    </tr>
                                ))
                                    :
                                    <tr>
                                        <td colSpan={5} className="px-4 py-3 text-center">No data to display</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {isOpen && <Dialog setIsOpen={setIsOpen} data={data} />}
            </div>
        </>
    )
}

function Dialog({ setIsOpen, data }: { setIsOpen: any, data: any }) {
    const closeDialog = () => setIsOpen(false);
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">

                {data}
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={closeDialog}
                        className=" bg-gray-300 text-gray-700"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}
