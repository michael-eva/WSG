'use client'
import { useEffect, useState } from "react"
import { getChangeData } from "../../(utils)/utils"
import { Badge } from "@/components/ui/badge";
import CashInput from "../../cash-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDaysIcon } from "@/components/ui/icons";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChangeOrderData } from "@/app/types";
import { formatNumber } from "@/utils/utils";

export default function Page({ params: { id } }: { params: { id: string } }) {
    const [changeData, setChangeData] = useState<ChangeOrderData>()
    const [selectedDate, setSelectedDate] = useState<string | undefined | null>(new Date().toLocaleDateString('en-AU'))
    const [isCountingDiscrepancy, setisCountingDiscrepancy] = useState<boolean>()


    useEffect(() => {
        async function getData() {
            const res: any = await getChangeData(id)
            setChangeData(res)
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
                            <h1 className="text-lg font-bold bg-gray-200 px-3 rounded-lg">{changeData?.clientName}</h1>
                        </div>
                        <div className="flex gap-5">
                            <h1 className="text-xl font-bold ">Change Order Value:</h1>
                            <h1 className="text-lg font-bold bg-gray-200 px-3 rounded-lg">{formatNumber(changeData?.grandTotal)}</h1>
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
                                    <Calendar initialFocus mode="single" onSelect={(e) => setSelectedDate(e?.toLocaleDateString('en-AU'))} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div>
                    {changeData?.guardReturnValue != changeData?.grandTotal &&
                        <div className="flex gap-5">
                            <h1 className="text-xl font-bold ">Guard Return Value:</h1>
                            <h1 className="text-lg font-bold bg-red-200 px-3 rounded-lg">${changeData?.guardReturnValue}</h1>
                            <p>Reason:{changeData?.guardDiscrepancyReason}</p>
                        </div>}
                    {isCountingDiscrepancy !== undefined && (
                        isCountingDiscrepancy
                            ? <Badge variant="destructive" className="w-24 flex justify-center py-1">Discrepancy</Badge>
                            : <Badge variant="outline" className="bg-green-600 text-white w-24 flex justify-center py-1">Balance</Badge>
                    )}
                </div>
                <CashInput isCountingDiscrepancy={isCountingDiscrepancy} balanceTo={changeData?.grandTotal} setisCountingDiscrepancy={setisCountingDiscrepancy} changeData={changeData} selectedDate={selectedDate} />

            </div >
        </>
    )
}

