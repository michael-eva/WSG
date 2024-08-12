'use client'

import { Badge } from "@/components/ui/badge"
import { formatNumber, getDate } from "@/utils/utils"
import { useEffect, useState } from "react"
import { getProcessedCash } from "../utils"
import { Dialog } from "@/components/Dialog"
import PlaceOrder from "../change-order/place-order"
import CashInput from "./(counting)/cash-input"
import { Button } from "@/components/ui/button"
type ProcessedCash = {
    countDate: Date;
    clientName: string;
    status: string;
    grandTotal: number;
}
export default function CashProcessing() {
    const [processedCash, setProcessedCash] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        async function getData() {
            const res: any = await getProcessedCash()
            setProcessedCash(res)
        }
        getData()
    }
        , [])
    const getStatus = (status: string) => {
        switch (status) {
            case 'awaiting banking':
                return 'Awaiting banking';
            case 'client payable':
                return 'Client payable';
            case 'paid':
                return 'Paid';
            case 'completed':
                return 'Paid';
            case 'counted':
                return 'Received';
            default:
                return 'Unknown';
        }

    }
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'client payable':
                return 'orange-500';
            case 'awaiting banking':
                return 'purple-500';
            case 'paid':
                return 'green-500';
            case 'completed':
                return 'green-500';
            case 'counted':
                return 'green-500';
            default:
                return 'gray-500';
        }

    }
    return (
        <div>
            <h1>Cash Processed</h1>
            <Button variant={"outline"} className="" onClick={() => setIsOpen(!isOpen)}>Enter Cash Processing</Button>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto flex max-h-[80vh] w-[751px]">
                <table className="w-full table-auto">
                    <thead className="bg-gray-100 text-gray-600 font-medium">
                        <tr>
                            <th className="px-4 py-3 ">Client</th>
                            <th className="px-4 py-3 ">Date Processed</th>
                            <th className="px-4 py-3 ">Status</th>
                            <th className="px-4 py-3 ">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {processedCash?.map((client) => (

                            <tr key={client.id}>
                                <td className="px-4 py-3 text-center">{client.clientName}</td>
                                <td className="px-4 py-3 text-center">{getDate(client.countDate)}</td>
                                <td className="px-4 py-3 text-center">
                                    <Badge variant="outline" className={`text-${getStatusColor(client.status)} border-${getStatusColor(client.status)}`}>{getStatus(client.status)}</Badge>
                                </td>
                                <td className="px-4 py-3 text-center">{formatNumber(client.grandTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isOpen && <Dialog setIsOpen={setIsOpen} >
                <CashInput />
            </Dialog>}
        </div>
    )

}

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import Select from "react-select"
// import { useEffect, useState } from "react";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { useForm, Controller, useFieldArray } from 'react-hook-form';
// import CashInput from "./(counting)/cash-input";
// import ParkingTins from "./(parking-tins)/ParkingTins";
// import { Badge } from "@/components/ui/badge";
// import { getClients } from "../utils";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarDaysIcon } from "@/components/ui/icons";
// import { Calendar } from "@/components/ui/calendar";


// export default function CashProcessing() {
//     const [step, setStep] = useState(1);
//     const { control, handleSubmit, watch, reset, setValue } = useForm({
//         defaultValues: {
//             client: '',
//             type: '',
//             dateCounted: '',
//             dateReceived: '',
//             clientCount: ""
//         },
//     });
//     const [clients, setClients] = useState<{ name: string, id: number, value?: string }[]>([])
//     console.log(step);

//     useEffect(() => {
//         async function getData() {
//             const res: any = await getClients()
//             setClients(res)
//         }
//         getData()
//     }
//         , [])

//     useEffect(() => {
//         setValue('client', "")
//         setValue('dateCounted', "")
//         setValue('dateReceived', "")
//     }
//         , [watch('type')])

//     return (
//         <div className="">
//             <h1>Cash Processing</h1>
//             <div className="flex flex-col">
//                 <div className="flex">
//                     <Card className="">
//                         <CardHeader>
//                             <CardTitle>Create project</CardTitle>
//                             <CardDescription>Deploy your new project in one-click.</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <form className="flex flex-col gap-5">
//                                 <div className="flex flex-col space-y-1.5">
//                                     <Label htmlFor="type">Type</Label>
//                                     <Controller
//                                         name="type"
//                                         control={control}
//                                         rules={{ required: true }}
//                                         render={({ field }) => (
//                                             <div className="flex space-x-2">
//                                                 <div
//                                                     className={`  px-3 py-2 rounded-lg hover:bg-slate-600 cursor-pointer hover:text-white shadow-md ${watch('type') === 'cash-swap' ? 'bg-slate-600 text-white' : 'bg-slate-300'}`}
//                                                     onClick={() => {
//                                                         field.onChange('cash-swap');
//                                                         setStep(2);
//                                                     }}
//                                                 >
//                                                     Cash Swap
//                                                 </div>
//                                                 <div
//                                                     className={` px-3 py-2 rounded-lg hover:bg-slate-600 cursor-pointer hover:text-white shadow-md ${watch('type') === 'cash-processing' ? 'bg-slate-600 text-white' : 'bg-slate-300'}`}
//                                                     onClick={() => {
//                                                         field.onChange('cash-processing');
//                                                         setStep(2);
//                                                     }}
//                                                 >
//                                                     Cash Processing
//                                                 </div>
//                                                 <div
//                                                     className={` px-3 py-2 rounded-lg hover:bg-slate-600 cursor-pointer hover:text-white shadow-md ${watch('type') === 'parking-tins' ? 'bg-slate-600 text-white' : 'bg-slate-300'}`}
//                                                     onClick={() => {
//                                                         field.onChange('parking-tins');
//                                                         setStep(2);
//                                                     }}
//                                                 >
//                                                     Parking Tins
//                                                 </div>
//                                             </div>
//                                         )}
//                                     />
//                                 </div>
//                                 <div className="flex gap-5 items-center">
//                                     <div className="flex flex-col space-y-1.5 min-w-[200px]">
//                                         <Label htmlFor="client">Client</Label>
//                                         <Controller
//                                             name="client"
//                                             control={control}
//                                             rules={{ required: true }}
//                                             render={({ field }) => (
//                                                 // <Select {...field} onValueChange={(e) => { field.onChange(e); setStep(3); }}>
//                                                 //     <SelectTrigger id="client">
//                                                 //         <SelectValue placeholder="Select" />
//                                                 //     </SelectTrigger>
//                                                 //     <SelectContent position="popper">
//                                                 //         {clients?.map(client => (
//                                                 //             <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem> // Use unique key and correct value
//                                                 //         ))}
//                                                 //     </SelectContent>
//                                                 // </Select>
//                                                 <Select
//                                                     options={clients.map(client => ({ label: client.name, value: client.name }))}
//                                                     onChange={(e) => {
//                                                         field.onChange(e);
//                                                         setStep(3);
//                                                     }}
//                                                     placeholder="Select"
//                                                     isDisabled={step < 2}
//                                                 />
//                                             )}
//                                             disabled={step < 2}
//                                         />
//                                     </div>
//                                     {/* <div className="flex flex-col space-y-1.5 min-w-[200px]">
//                                         <label htmlFor="client" className="text-sm font-medium">Client</label>
//                                         <Controller
//                                             name="client"
//                                             control={control}
//                                             rules={{ required: true }}
//                                             render={({ field }) => (
//                                                 <Select
//                                                     {...field}
//                                                     options={clients.map(client => ({ label: client.name, value: client.name }))}
//                                                     onChange={(e) => {
//                                                         field.onChange(e);
//                                                         setStep(3);
//                                                     }}
//                                                     placeholder="Select"
//                                                     isDisabled={step < 2}
//                                                 />
//                                             )}
//                                         />
//                                     </div> */}
//                                     {watch('type') === "cash-processing" &&
//                                         <div className="flex flex-col space-y-1.5 min-w-[200px]">
//                                             <Label htmlFor="clientCount">Client Count</Label>
//                                             <Controller
//                                                 name="clientCount"
//                                                 control={control}
//                                                 rules={{ required: true }}
//                                                 render={({ field }) => (
//                                                     <Input
//                                                         {...field}
//                                                         type="number"
//                                                         className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                                         onChange={(e) => { field.onChange(e.target.value); setStep(4) }}
//                                                         placeholder="eg: $300"
//                                                     />
//                                                 )}
//                                                 disabled={step < 3}
//                                             />
//                                         </div>
//                                     }
//                                     <div className="relative">
//                                         <Label htmlFor="dateReceived">Date Received</Label>
//                                         <Controller
//                                             name="dateReceived"
//                                             control={control}
//                                             rules={{ required: true }}
//                                             render={({ field }) => (
//                                                 <Popover>
//                                                     <PopoverTrigger asChild>
//                                                         <Button className="w-full" variant="outline" disabled={step < 4}>
//                                                             {watch("dateReceived") && watch("dateReceived")}
//                                                             <CalendarDaysIcon className="ml-2 h-4 w-4" />
//                                                         </Button>
//                                                     </PopoverTrigger>
//                                                     <PopoverContent align="start" className="w-auto p-0">
//                                                         <Calendar initialFocus mode="single" onSelect={(e) => { setValue("dateReceived", e!.toLocaleDateString('en-AU')); setStep(5) }} />
//                                                     </PopoverContent>
//                                                 </Popover>
//                                             )}

//                                         />
//                                     </div>
//                                     <div className="relative">
//                                         <Label htmlFor="dateCounted">Date Counted</Label>
//                                         <Controller
//                                             name="dateCounted"
//                                             control={control}
//                                             rules={{ required: true }}
//                                             render={({ field }) => (
//                                                 <Popover>
//                                                     <PopoverTrigger asChild>
//                                                         <Button className="w-full" variant="outline" disabled={step < 5}>
//                                                             {watch("dateCounted") && watch("dateCounted")}
//                                                             <CalendarDaysIcon className="ml-2 h-4 w-4" />
//                                                         </Button>
//                                                     </PopoverTrigger>
//                                                     <PopoverContent align="start" className="w-auto p-0">
//                                                         <Calendar initialFocus mode="single" onSelect={(e) => { setValue("dateCounted", e!.toLocaleDateString('en-AU')); setStep(6) }} />
//                                                     </PopoverContent>
//                                                 </Popover>
//                                             )}
//                                         />
//                                     </div>
//                                 </div>
//                             </form>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 <div className="">
//                     {watch('type') === 'cash-swap' &&
//                         <div>
//                             <div className="flex gap-5 align-middle pb-4 items-center">
//                                 <h1 className="text-3xl font-bold ">Change Order Value:</h1>
//                                 <h1 className="text-2xl font-bold bg-gray-200 px-3 rounded-lg">$1,234.56</h1>
//                                 <Badge variant="destructive" className=" w-24 flex justify-center py-1">Discrepancy</Badge>
//                                 <Badge variant="outline" className=" bg-green-600 text-white w-24 flex justify-center py-1">Balance</Badge>
//                             </div>
//                             {/* <CashInput /> */}
//                         </div>}
//                     {watch('type') === 'cash-processing' &&
//                         <div>
//                             <CashInput client={watch('client')?.value} clientCount={watch('clientCount')} dateReceived={watch('dateReceived')} dateCounted={watch('dateCounted')} />
//                         </div>
//                     }
//                     {
//                         watch('type') === 'parking-tins' &&
//                         <ParkingTins setStep={setStep} />
//                     }
//                 </div>
//             </div>
//         </div>
//     );
// }