import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { CalendarDaysIcon, ChevronDownIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { handleEFTOrder, insertCashOrderData, insertChangeData } from '../utils';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Select from 'react-select'
import toast from 'react-hot-toast';
import { formatNumber } from '@/utils/utils';
import { getClients, getEFTData, getRuns } from './utils';
import { Checkbox } from '@/components/ui/checkbox';

type client = {
    id?: string,
    name: string
}
export default function PlaceOrder({ clients, type, fetchData, runs }: { type: "cashOrder" | "changeOrder" | undefined, fetchData?: any, clients?: client[] | null, runs?: { name: string }[] | null }) {
    const [isEFT, setIsEFT] = useState<boolean | undefined>(undefined);
    const [eftData, setEFTData] = useState<any[]>([]);
    const { control, handleSubmit, setValue, watch, setError, clearErrors, formState, reset } = useForm({
        defaultValues: {
            client: '',
            dateReceived: '',
            deliveryDate: '',
            run: '',
            quantities: Array(10).fill(''), // Assuming 9 inputs for money values
        },
        mode: 'all', // Validates the form on all interactions
        reValidateMode: 'onChange' // Re-validates the form on every change
    });
    useEffect(() => {
        const getData = async () => {
            const data = await getEFTData();
            if (data) {
                setEFTData(data)
            }
        }
        getData()
    }, [])
    useEffect(() => {
        reset()
    }, [isEFT])

    const noteIndices = [0, 1, 2, 3];
    const coinIndices = [4, 5, 6, 7, 8, 9];

    // Watch the quantities of interest
    const noteQuantities = watch(noteIndices.map(index => `quantities.${index}` as const));
    const coinQuantities = watch(coinIndices.map(index => `quantities.${index}` as const));

    const currencyValues = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5];
    const noteTotal = noteQuantities.reduce((acc, current, index) => {
        return acc + (parseFloat(current) || 0);
    }, 0);
    const coinTotal = coinQuantities.reduce((acc, current, index) => {
        return acc + (parseFloat(current) || 0);
    }, 0);
    const grandTotal = noteTotal + coinTotal
    const quantities = watch("quantities");
    useEffect(() => {
        quantities.forEach((quantity, index) => {
            const currencyValue = currencyValues[index];
            const valueInCents = (quantity * 100).toFixed(0); // Convert dollar input to cents for comparison
            if (quantity !== "" && (parseFloat(valueInCents) % currencyValue !== 0)) {
                setError(`quantities.${index}` as const, {
                    type: "manual",
                    message: `Must be a multiple of ${currencyValue / 100}`
                });
            } else {
                clearErrors(`quantities.${index}`);
            }
        });
    }, [grandTotal]);

    const onSubmit = (data: any) => {
        console.log({ ...data, isEFT });
        if (type === "cashOrder") {
            insertCashOrderData(data, coinTotal, noteTotal, grandTotal)
                .then(() => {
                    window.location.href = '/cash-room/change-order'
                })

        } else if (type === "changeOrder") {
            if (isEFT === false) {
                insertChangeData(data, coinTotal, noteTotal, grandTotal)
                    .then(() => {
                        toast.success("Success!");
                        reset();
                    }).finally(() => { fetchData() })
                    .catch((error) => {
                        console.error("Error entering change order:", error);
                        toast.error("Failed to enter change order. Please try again.");
                    });
            } else if (isEFT === true) {
                console.log(data);

                handleEFTOrder(data, coinTotal, noteTotal, grandTotal)
                    .then((result) => {
                        if (result) {
                            toast.success("EFT order processed successfully!");
                            reset();
                        } else {
                            toast.error("Failed to process EFT order. Please try again.");
                        }
                    })
                    .finally(() => { fetchData() })
                    .catch((error) => {
                        console.error("Error processing EFT order:", error);
                        toast.error("An error occurred while processing the EFT order.");
                    });
            }
        }
        setIsEFT(undefined)
    };
    console.log("eft data", eftData);
    console.log(watch('client'));



    return (
        <>
            {type && type === 'cashOrder' ? <CashOrder
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                control={control}
                noteTotal={noteTotal}
                coinTotal={coinTotal}
                grandTotal={grandTotal}
                formState={formState}
                setValue={setValue}
            />
                :
                <ChangeOrder
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    control={control}
                    clients={clients}
                    runs={runs}
                    noteTotal={noteTotal}
                    coinTotal={coinTotal}
                    grandTotal={grandTotal}
                    formState={formState}
                    isEFT={isEFT}
                    setIsEFT={setIsEFT}
                    eftData={eftData}
                />}
        </>
    );
}
function ChangeOrder({ handleSubmit, onSubmit, control, clients, runs, noteTotal, coinTotal, grandTotal, formState, isEFT, setIsEFT, eftData }: { handleSubmit: any, onSubmit: any, control: any, clients: { name: string }[] | undefined | null, runs: { name: string }[] | undefined | null, noteTotal: any, coinTotal: any, grandTotal: any, formState: any, isEFT: boolean | undefined, setIsEFT: any, eftData: any[] }) {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className='text-center'>Place Change Order</h1>
                <Separator className='mb-6' />
                <div className='mb-4'>
                    <h2>Order Type:</h2>
                    <div className='space-y-4 '>
                        <div className='flex gap-2'>
                            <Checkbox checked={isEFT} onCheckedChange={() => setIsEFT(true)} />
                            <Label>EFT</Label>
                        </div>
                        <div className='flex gap-2'>
                            <Checkbox checked={isEFT === false} onCheckedChange={() => setIsEFT(false)} />
                            <Label>Cash</Label>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 pb-4">
                    {!isEFT ? <Controller
                        name="client"
                        control={control}
                        rules={{ required: clients && clients.length > 0 ? "Client name is required" : false }}
                        render={({ field, fieldState: { error } }) => (
                            <Select
                                options={clients?.map(client => ({ label: client.name, value: client.name }))}
                                onChange={(e) => {
                                    field.onChange(e);
                                }}
                                placeholder="Select client"
                                isDisabled={isEFT === undefined}
                                value={field.value}
                            />
                        )}
                        disabled={isEFT === undefined}
                    /> :
                        eftData && eftData.length > 0 &&
                        <Controller
                            name="client"
                            control={control}
                            rules={{ required: clients && clients.length > 0 ? "Client name is required" : false }}
                            render={({ field, fieldState: { error } }) => (
                                <Select
                                    options={eftData?.map(client => ({ label: `${client.clientName} - ${formatNumber(client.eftValue)}`, value: client.clientName, id: client.id }))}
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                    placeholder="Select client"
                                    isDisabled={isEFT === undefined}
                                    value={field.value}
                                />
                            )}
                            disabled={isEFT === undefined}
                        />
                    }
                    <Controller
                        name="dateReceived"
                        control={control}
                        rules={{ required: "Date received is required" }}
                        render={({ field, fieldState: { error } }) => (
                            <Popover>
                                <div>
                                    <PopoverTrigger asChild>
                                        <Button className="w-full" variant="outline" disabled={isEFT === undefined}>
                                            {field.value ? (new Date(field.value)).toLocaleDateString() : "Date Received"}
                                            <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-auto p-0">
                                        <Calendar initialFocus mode="single" onSelect={field.onChange} disabled={isEFT === undefined} />
                                    </PopoverContent>
                                    {error && <p className="text-red-500 text-xs mt-1 text-center">*{error.message}</p>}
                                </div>
                            </Popover>
                        )}
                        disabled={isEFT === undefined}
                    />
                    <Controller
                        name="deliveryDate"
                        control={control}
                        rules={{ required: "Delivery date is required" }}
                        render={({ field, fieldState: { error } }) => (
                            <Popover>
                                <div>
                                    <PopoverTrigger asChild>
                                        <Button className="w-full" variant="outline" disabled={isEFT === undefined}>
                                            {field.value ? (new Date(field.value)).toLocaleDateString() : "Delivery Date"}
                                            <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-auto p-0">
                                        <Calendar initialFocus mode="single" onSelect={field.onChange} disabled={isEFT === undefined} />
                                    </PopoverContent>
                                    {error && <p className="text-red-500 text-xs mt-1 text-center">*{error.message}</p>}
                                </div>
                            </Popover>
                        )}
                        disabled={isEFT === undefined}
                    />
                    <Controller
                        name="run"
                        control={control}
                        rules={{ required: runs && runs.length > 0 ? "Run selection is required" : false }}
                        render={({ field, fieldState: { error } }) => (
                            <DropdownMenu>
                                <div>
                                    <DropdownMenuTrigger asChild disabled={isEFT === undefined}>
                                        <Button className="w-full" variant="outline">
                                            {field.value || "Select a Run"} <ChevronDownIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-full">
                                        {runs?.map(run => (
                                            <DropdownMenuItem key={run.name} onClick={() => field.onChange(run.name)}>
                                                {run.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                    {error && <p className="text-red-500 text-xs mt-1 text-center">*{error.message}</p>}
                                </div>
                            </DropdownMenu>
                        )}
                        disabled={isEFT === undefined}
                    />
                </div>
                <div className="grid grid-cols-1 gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-4 gap-2">
                            {['$50', '$20', '$10', '$5'].map((amount, index) => (
                                <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2">
                                    <div className="text-lg font-semibold">{amount}</div>
                                    <Controller
                                        name={`quantities.${index}`}
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input {...field} className="w-full mt-2" placeholder="Quantity" type="number" />
                                                {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                            </>
                                        )}
                                        disabled={isEFT === undefined}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                            Note Total: {formatNumber(noteTotal)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-6 gap-2">
                            {['$2', '$1', '50c', '20c', '10c', '5c'].map((amount, index) => (
                                <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2">
                                    <div className="text-lg font-semibold">{amount}</div>
                                    <Controller
                                        name={`quantities.${index + 4}`}
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input {...field} className="w-full mt-2" placeholder="Quantity" type="number" />
                                                {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                            </>
                                        )}
                                        disabled={isEFT === undefined}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                            Coin Total: {formatNumber(coinTotal)}
                        </div>
                    </div>
                </div>
                <div className=" mt-4 flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                    Grand Total: {formatNumber(grandTotal)}
                </div>
                <div className="flex justify-end">
                    <Button className="mt-4" type="submit" disabled={!formState.isValid || !formState.isDirty}>
                        Submit
                    </Button>
                </div>
            </form>
        </main>
    )
}
function CashOrder({ handleSubmit, onSubmit, control, noteTotal, coinTotal, grandTotal, formState, setValue }: any) {
    const today = new Date().toLocaleDateString('en-AU');
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className='text-center'>Armaguard order</h1>
                <Separator className='mb-6' />
                <div className="grid grid-cols-4 gap-2 pb-4">
                    <Controller
                        name="dateReceived"
                        control={control}
                        // rules={{ required: "Date received is required" }}
                        render={({ field, fieldState: { error } }) => (
                            <div className=' flex flex-col gap-1'><Label>Order Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="w-full" variant="outline">
                                            {/* {today || field.value}
                                             */}
                                            {field.value ? (new Date(field.value)).toLocaleDateString() : today}
                                            <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-auto p-0" >
                                        <Calendar initialFocus mode="single" onSelect={field.onChange} />
                                    </PopoverContent>
                                    {error && <p className="text-red-500 text-xs mt-1 text-center">*{error.message}</p>}
                                </Popover>
                            </div>
                        )}
                    />
                    <Controller
                        name="deliveryDate"
                        control={control}
                        rules={{ required: "Pickup date is required" }}
                        render={({ field, fieldState: { error } }) => (
                            <div className='flex flex-col gap-1'>
                                <Label>Pickup Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="w-full" variant="outline">
                                            {field.value ? new Date(field.value).toLocaleDateString() : "Pickup Date"}
                                            <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-auto p-0">

                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {error && <p className="text-red-500 text-xs mt-1 text-center">*{error.message}</p>}
                            </div>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-4 gap-2">
                            {['$50', '$20', '$10', '$5'].map((amount, index) => (
                                <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 ">
                                    <div className="text-lg font-semibold">{amount}</div>
                                    <Controller
                                        name={`quantities.${index}`}
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input {...field} className="w-full mt-2" placeholder="Quantity" type="number" />
                                                {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                            </>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                            Note Total: ${noteTotal.toFixed(2)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-6 gap-2">
                            {['$2', '$1', '50c', '20c', '10c', '5c'].map((amount, index) => (
                                <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2">
                                    <div className="text-lg font-semibold">{amount}</div>
                                    <Controller
                                        name={`quantities.${index + 4}`}
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Input {...field} className="w-full mt-2" placeholder="Quantity" type="number" />
                                                {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                            </>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                            Coin Total: ${coinTotal.toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className=" mt-4 flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                    Grand Total: ${grandTotal.toFixed(2)}
                </div>
                <div className="flex justify-end">
                    <Button className="mt-4" type="submit" disabled={!formState.isValid || !formState.isDirty}>
                        Submit
                    </Button>
                </div>
            </form>

        </main>
    )
}




