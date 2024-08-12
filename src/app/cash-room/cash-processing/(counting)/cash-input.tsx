"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator";
import { ReactNode, useEffect, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea";
import { insertCashProcessingCountedData } from "./utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "@/components/ui/icons";
import Select from "react-select"
import { getClients } from "../../utils";
import toast from "react-hot-toast";
import { formatNumber } from "@/utils/utils";

interface FormData {
    recycledCash: string[];
    countedCash: string[];
    clientCount: number,
    dateReceived: ReactNode,
    dateCounted: ReactNode,
    client: string,
}

const currencyValues = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5];

export default function CashInput() {
    const [selectedValue, setSelectedValue] = useState<string>("")
    const [isError, setIsError] = useState<boolean>(false)
    const [countDiscrepancyReason, setCountDiscrepancyReason] = useState<string>("")
    const [isCountingDiscrepancy, setisCountingDiscrepancy] = useState<boolean>(false)
    const [isRecycleDiscrepancy, setIsRecycleDiscrepancy] = useState<boolean>()
    const [clients, setClients] = useState<{ name: string, id: string }[] | null>([])

    const { control, handleSubmit, watch, formState, reset } = useForm<FormData>({
        defaultValues: {
            countedCash: Array(11).fill(''),
            recycledCash: Array(11).fill(''),
            clientCount: 0,
            dateReceived: "",
            dateCounted: "",
            client: ""
        },
        mode: 'all',
        reValidateMode: 'onChange'
    });

    const { errors, isDirty } = formState;
    const hasErrors = Object.keys(errors).length > 0;

    const countedCashValues = watch("countedCash");
    const recycledCashValues = watch("recycledCash");

    const noteTotal = countedCashValues.slice(0, 5).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const coinTotal = countedCashValues.slice(5).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const grandTotal = noteTotal + coinTotal;
    const recycledNoteTotal = recycledCashValues.slice(0, 5).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const recycledCoinTotal = recycledCashValues.slice(5).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const recycledGrandTotal = recycledNoteTotal + recycledCoinTotal;

    console.log("grand total:", typeof (grandTotal));
    console.log("client count:", typeof (watch("clientCount")));
    console.log("is counting discrepancy:", isCountingDiscrepancy);


    useEffect(() => {
        async function getData() {

            const res = await getClients()
            setClients(res)
        }
        getData()
    }, [])
    useEffect(() => {
        if (recycledGrandTotal > grandTotal) {
            setIsRecycleDiscrepancy(true)
        } else {
            setIsRecycleDiscrepancy(false);
        }
    }, [recycledGrandTotal, grandTotal]);

    useEffect(() => {
        const clientCount = watch('clientCount');
        if (isNaN(clientCount) || Math.abs(grandTotal - clientCount) > 0.0001) {
            setisCountingDiscrepancy(true);
        } else {
            setisCountingDiscrepancy(false);
        }
    }, [grandTotal, watch("clientCount")]);

    useEffect(() => {
        if (isRecycleDiscrepancy === true || hasErrors || isDirty) {
            setIsError(true)
        }
        setIsError(false)
    }, [isDirty, hasErrors, isRecycleDiscrepancy, selectedValue])

    const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handleSubmit(onSubmit)()
    };

    const onSubmit = async (data: FormData) => {
        const bankedGrandTotal = grandTotal - recycledGrandTotal;
        const bankedNotesTotal = noteTotal - recycledNoteTotal;
        const bankedCoinTotal = coinTotal - recycledCoinTotal;

        await insertCashProcessingCountedData(
            //@ts-ignore
            data, watch("dateCounted")!.toString(), watch("dateReceived")!.toString(), watch("client").value, bankedGrandTotal, noteTotal, coinTotal, grandTotal, recycledNoteTotal,
            recycledCoinTotal, recycledGrandTotal, countDiscrepancyReason, bankedNotesTotal, bankedCoinTotal, watch('clientCount')
        ).then(() => toast.success("Successfully submitted")).then(() => reset()).finally(() => { window.location.reload() })
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <form>
                <h1 className="text-center">Cash Processing</h1>
                <Separator className='mb-6' />
                <div className="flex gap-2 justify-evenly items-center">
                    <div className="w-1/2">
                        <Label htmlFor="clientCount">Select Client</Label>
                        <Controller
                            name="client"
                            control={control}
                            rules={{ required: clients && clients.length > 0 ? "Client name is required" : false }}
                            render={({ field, fieldState: { error } }) => (
                                <Select
                                    //@ts-ignore
                                    options={clients?.map(client => ({ label: client.name, value: client.name }))}
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                    placeholder="Select client"
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <div className="w-1/2">
                        <Label htmlFor="clientCount">Client Count</Label>
                        <Controller
                            name="clientCount"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder="eg: $300"
                                    value={field.value !== 0 ? field.value : undefined}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <Label htmlFor="dateReceived">Date Received</Label>
                        <Controller
                            name="dateReceived"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="w-full" variant="outline">
                                            {field.value instanceof Date
                                                ? field.value.toLocaleDateString()
                                                : "Select Date"}
                                            <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-auto p-0">
                                        <Calendar initialFocus mode="single" onSelect={field.onChange} />
                                    </PopoverContent>
                                </Popover>
                            )}

                        />
                    </div>
                    <div className="w-1/2">
                        <Label htmlFor="dateCounted">Date Counted</Label>
                        <Controller
                            name="dateCounted"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="w-full" variant="outline" >
                                            {field.value instanceof Date
                                                ? field.value.toLocaleDateString()
                                                : "Select Date"}
                                            <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-auto p-0">
                                        <Calendar initialFocus mode="single" onSelect={field.onChange} />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                </div>
                {/* @ts-ignore */}
                <h1>{watch("client").value}</h1>
                <CashCountElement control={control} noteTotal={noteTotal} coinTotal={coinTotal} grandTotal={grandTotal} recycledNoteTotal={recycledNoteTotal} recycledCoinTotal={recycledCoinTotal} recycledGrandTotal={recycledGrandTotal} countedCashValues={countedCashValues} isRecycleDiscrepancy={isRecycleDiscrepancy} setSelectedValue={setSelectedValue} selectedValue={selectedValue} />
                {(selectedValue.length > 0 && !isError) && <SubmitDialog clientCount={watch("clientCount")} client={watch("client")} isCountingDiscrepancy={isCountingDiscrepancy} handleFormSubmit={handleFormSubmit} recycledCoinTotal={recycledCoinTotal} recycledGrandTotal={recycledGrandTotal} recycledNoteTotal={recycledNoteTotal} coinTotal={coinTotal} noteTotal={noteTotal} grandTotal={grandTotal} countDiscrepancyReason={countDiscrepancyReason} setCountDiscrepancyReason={setCountDiscrepancyReason} />}
            </form>
        </div>
    )
}

function CashCountElement({ control, noteTotal, coinTotal, grandTotal, recycledNoteTotal, recycledCoinTotal, recycledGrandTotal, countedCashValues, isRecycleDiscrepancy, setSelectedValue, selectedValue }: { control: any, noteTotal: number, coinTotal: number, grandTotal: number, recycledNoteTotal: number, recycledCoinTotal: number, recycledGrandTotal: number, countedCashValues: string[], isRecycleDiscrepancy: boolean | undefined, setSelectedValue: any, selectedValue: string }) {
    return (
        <>
            <CashCountForm control={control} prefix="countedCash" noteTotal={noteTotal} coinTotal={coinTotal} grandTotal={grandTotal} />
            <Separator />
            <section>
                <div className="flex gap-2">
                    <h1 className="text-2xl font-bold">Recycle cash?</h1>
                    <div>
                        {isRecycleDiscrepancy && <Badge variant="destructive" className=" flex py-2">Recycle cash can't be more than counted cash</Badge>}
                    </div>
                </div>
                <RadioGroup className="flex" onValueChange={(e) => setSelectedValue(e)} value={selectedValue}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" className="text-xl" />
                        <Label htmlFor="yes" className="text-xl">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="text-xl">No</Label>
                    </div>
                </RadioGroup>
            </section>
            {selectedValue === "yes" && <div className="flex flex-col gap-4">
                <RecycledCashForm control={control} prefix="recycledCash" noteTotal={recycledNoteTotal} coinTotal={recycledCoinTotal} grandTotal={recycledGrandTotal} countedCashValues={countedCashValues} />
            </div>}
        </>
    )
}

const RecycledCashForm = ({ control, prefix, coinTotal, noteTotal, grandTotal, countedCashValues }: { control: any, prefix: string, coinTotal: number, noteTotal: number, grandTotal: number, countedCashValues: string[] }) => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-10">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2">
                        {['$100', '$50', '$20', '$10', '$5'].map((amount, index) => (
                            <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-green-100 p-2">
                                <div className="text-lg font-semibold">{amount}</div>
                                <Controller
                                    name={`${prefix}.${index}`}
                                    control={control}
                                    rules={{
                                        validate: {
                                            multipleOfDenomination: (value) => {
                                                if (value === '') return true; // No error if the field is empty
                                                const numericValue = parseFloat(value);
                                                if (isNaN(numericValue)) return "Invalid number"; // Check if the value is a valid number
                                                const valueInCents = numericValue * 100; // Convert to cents
                                                const currencyValueInCents = currencyValues[index];
                                                return (valueInCents % currencyValueInCents === 0) || `Must be a multiple of ${currencyValueInCents / 100}`;
                                            },
                                            lessThanOrEqualToCounted: (value) => {
                                                if (value === '') return true; // No error if the field is empty
                                                const numericValue = parseFloat(value);
                                                if (isNaN(numericValue)) return "Invalid number"; // Check if the value is a valid number
                                                const countedValue = parseFloat(countedCashValues[index]);
                                                return numericValue <= countedValue || `Value cannot exceed ${countedValue}`;
                                            }
                                        }
                                    }}
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
                    <div className="flex items-center justify-center rounded-lg bg-green-300 p-4 text-lg font-semibold dark:bg-gray-800">
                        Note Total: ${noteTotal.toFixed(2)}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-6 gap-2">
                        {['$2', '$1', '50c', '20c', '10c', '5c'].map((amount, index) => (
                            <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-green-100 p-2">
                                <div className="text-lg font-semibold">{amount}</div>
                                <Controller
                                    name={`recycledCash.${index + 5}`}
                                    control={control}
                                    rules={{
                                        validate: {
                                            multipleOfDenomination: (value) => {
                                                if (value === '') return true; // No error if the field is empty
                                                const numericValue = parseFloat(value);
                                                if (isNaN(numericValue)) return "Invalid number"; // Check if the value is a valid number
                                                const valueInCents = parseFloat((numericValue * 100).toFixed(0))
                                                // Validate both whole number for dollars and exact value for cents
                                                return (numericValue % (currencyValues[index + 5] / 100) === 0 ||
                                                    valueInCents % currencyValues[index + 5] === 0) ||
                                                    `Must be a multiple of ${currencyValues[index + 5] / 100}`;
                                            }
                                        }
                                    }}
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
                    <div className="flex items-center justify-center rounded-lg bg-green-300 p-4 text-lg font-semibold dark:bg-gray-800">
                        Coin Total: ${coinTotal.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className=" mt-4 flex items-center justify-center rounded-lg bg-green-300 p-4 text-lg font-semibold dark:bg-gray-800">
                Grand Total: ${grandTotal.toFixed(2)}
            </div>
        </div>
    )
}

const CashCountForm = ({ control, prefix, coinTotal, noteTotal, grandTotal }: { control: any, prefix: string, coinTotal: number, noteTotal: number, grandTotal: number }) => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-10">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2">
                        {['$100', '$50', '$20', '$10', '$5'].map((amount, index) => (
                            <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-blue-100 p-2">
                                <div className="text-lg font-semibold">{amount}</div>
                                <Controller
                                    name={`${prefix}.${index}`}
                                    control={control}
                                    rules={{
                                        validate: {
                                            multipleOfDenomination: (value) => {
                                                if (value === '') return true; // No error if the field is empty
                                                const numericValue = parseFloat(value);
                                                if (isNaN(numericValue)) return "Invalid number"; // Check if the value is a valid number
                                                const valueInCents = numericValue * 100; // Convert to cents
                                                // Validate both whole number for dollars and exact value for cents
                                                return (numericValue % (currencyValues[index] / 100) === 0 ||
                                                    valueInCents % currencyValues[index] === 0) ||
                                                    `Must be a multiple of ${currencyValues[index] / 100}`;
                                            }
                                        }
                                    }}
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
                    <div className="flex items-center justify-center rounded-lg bg-blue-200 p-4 text-lg font-semibold dark:bg-gray-800">
                        Note Total: ${noteTotal.toFixed(2)}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-6 gap-2">
                        {['$2', '$1', '50c', '20c', '10c', '5c'].map((amount, index) => (
                            <div key={index} className="flex flex-col items-center justify-center rounded-lg bg-blue-100 p-2">
                                <div className="text-lg font-semibold">{amount}</div>
                                <Controller
                                    name={`countedCash.${index + 5}`}
                                    control={control}
                                    rules={{
                                        validate: {
                                            multipleOfDenomination: (value) => {
                                                if (value === '') return true; // No error if the field is empty
                                                const numericValue = parseFloat(value);
                                                console.log(numericValue);
                                                if (isNaN(numericValue)) return "Invalid number"; // Check if the value is a valid number
                                                const valueInCents = parseFloat((numericValue * 100).toFixed(0)); // Convert to cents
                                                // Validate both whole number for dollars and exact value for cents
                                                return (numericValue % (currencyValues[index + 5] / 100) === 0 ||
                                                    valueInCents % currencyValues[index + 5] === 0) ||
                                                    `Must be a multiple of ${currencyValues[index + 5] / 100}`;
                                            }
                                        }
                                    }}
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
                    <div className="flex items-center justify-center rounded-lg bg-blue-200 p-4 text-lg font-semibold dark:bg-gray-800">
                        Coin Total: ${coinTotal.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className=" mt-4 flex items-center justify-center rounded-lg bg-blue-200 p-4 text-lg font-semibold dark:bg-gray-800">
                Grand Total: ${grandTotal.toFixed(2)}
            </div>
        </div>
    )
}

function SubmitDialog({ clientCount, client, recycledCoinTotal, recycledNoteTotal, recycledGrandTotal, noteTotal, coinTotal, grandTotal, handleFormSubmit, isCountingDiscrepancy, countDiscrepancyReason, setCountDiscrepancyReason }: { clientCount: number, client: string, recycledCoinTotal: number, recycledNoteTotal: number, recycledGrandTotal: number, noteTotal: number, coinTotal: number, grandTotal: number, handleFormSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void, isCountingDiscrepancy: boolean | undefined, countDiscrepancyReason: string, setCountDiscrepancyReason: any }) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={clientCount === 0 || client.length === 0 || grandTotal === 0}>Submit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    {/* @ts-ignore */}
                    <DialogTitle>Review count for {client.value}</DialogTitle>
                    <DialogDescription>
                        Once submitted, this <strong>cannot</strong> be changed.
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-gray-100 p-4">
                    <div className="grid grid-cols-5 gap-4 font-bold text-center">
                        <div className="col-span-2"></div>
                        <div>Coin</div>
                        <div>Notes</div>
                        <div>Total</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center py-2 ">
                        <div className="font-bold col-span-2 text-left">Client Count</div>
                        <div>-</div>
                        <div>-</div>
                        <div>{formatNumber(clientCount)}</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center py-2">
                        <div className="font-bold col-span-2 text-left">Counted </div>
                        <div>{formatNumber(coinTotal)}</div>
                        <div>{formatNumber(noteTotal)}</div>
                        <div>{formatNumber(grandTotal)}</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center py-2">
                        <div className="font-bold col-span-2 text-left">Recycled </div>
                        <div>{formatNumber(recycledCoinTotal)}</div>
                        <div>{formatNumber(recycledNoteTotal)}</div>
                        <div>{formatNumber(recycledGrandTotal)}</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center py-2">
                        <div className="font-bold col-span-2 text-left">Banked </div>
                        <div>{formatNumber(coinTotal - recycledCoinTotal)}</div>
                        <div>{formatNumber(noteTotal - recycledNoteTotal)}</div>
                        <div>{formatNumber(grandTotal - recycledGrandTotal)}</div>
                    </div>
                </div>
                {isCountingDiscrepancy && <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold">Reason for discrepancy:</h2>
                    <Textarea
                        placeholder="Type your message here."
                        value={countDiscrepancyReason ?? ""}
                        onChange={(e) => setCountDiscrepancyReason(e.target.value)}
                        required={true}
                    />
                </div>}
                <DialogFooter>
                    <Button type="submit" onClick={handleFormSubmit} disabled={isCountingDiscrepancy && !countDiscrepancyReason}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
