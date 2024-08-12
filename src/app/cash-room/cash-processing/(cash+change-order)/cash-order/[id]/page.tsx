'use client'
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge";
import CashInput from "../../cash-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDaysIcon } from "@/components/ui/icons";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { getCashOrderData } from "../../(utils)/utils";

type OrderData = {
    id: string,
    name: string;
    coinTotal: number;
    created_at: string;
    deliveryDate: string;
    fifty: number | null;
    fiftyC: number | null;
    five: number | null;
    fiveC: number | null;
    grandTotal: number;
    noteTotal: number;
    one: number | null;
    orderDate: string;
    run: string;
    status: "pending" | "packed";
    ten: number | null;
    tenC: number | null;
    twenty: number | null;
    twentyC: number | null;
    two: number | null;
    guardReturnValue: number | null;
    guardDiscrepancyReason: string | null;


}
export default function Page({ params: { id } }: { params: { id: string } }) {
    const [cashOrderData, setCashOrderData] = useState<OrderData>()
    const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toLocaleDateString("en-AU"))
    const [isCountingDiscrepancy, setisCountingDiscrepancy] = useState<boolean>()


    useEffect(() => {
        async function getData() {
            const res: any = await getCashOrderData(id)
            setCashOrderData(res)
        }
        getData()
    }, [])

    return (
        <>
            <div>
                <div className="flex gap-5">
                    <div className=" flex gap-5">
                        <div className=" flex gap-5">
                            <h1 className="text-xl font-bold ">Client:</h1>
                            <h1 className="text-lg font-bold bg-gray-200 px-3 rounded-lg">{cashOrderData?.name}</h1>
                        </div>
                        <div className="flex gap-5">
                            <h1 className="text-xl font-bold ">Cash Order Value:</h1>
                            <h1 className="text-lg font-bold bg-gray-200 px-3 rounded-lg">${cashOrderData?.grandTotal}</h1>
                        </div>
                        <div className="">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="w-full" variant="outline" >
                                        {selectedDate && selectedDate}
                                        <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-auto p-0">
                                    <Calendar initialFocus mode="single" onSelect={(e) => setSelectedDate(e!.toLocaleDateString('en-AU'))} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div>
                    {/* {cashOrderData?.guardReturnValue != cashOrderData?.grandTotal &&
                        <div className="flex gap-5">
                            <h1 className="text-xl font-bold ">Guard Return Value:</h1>
                            <h1 className="text-lg font-bold bg-red-200 px-3 rounded-lg">${cashOrderData?.guardReturnValue}</h1>
                            <p>Reason:{cashOrderData?.guardDiscrepancyReason}</p>
                        </div>} */}
                    {isCountingDiscrepancy !== undefined && (
                        isCountingDiscrepancy
                            ? <Badge variant="destructive" className="w-24 flex justify-center py-1">Discrepancy</Badge>
                            : <Badge variant="outline" className="bg-green-600 text-white w-24 flex justify-center py-1">Balance</Badge>
                    )}
                </div>
                <CashInput isCountingDiscrepancy={isCountingDiscrepancy} balanceTo={cashOrderData?.grandTotal} setisCountingDiscrepancy={setisCountingDiscrepancy} cashOrderData={cashOrderData} selectedDate={selectedDate} />

            </div >
        </>
    )
}

