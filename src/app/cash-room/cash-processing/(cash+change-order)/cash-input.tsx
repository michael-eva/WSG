"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useForm, Controller, FormState } from 'react-hook-form';
import { insertCashCount, insertCashOrderCount } from "./(utils)/utils";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/utils/utils";
interface FormData {
    recycledCash: string[];
    countedCash: string[];
}

const currencyValues = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5];
export default function CashInput({ balanceTo, setisCountingDiscrepancy, changeData, selectedDate, isCountingDiscrepancy, cashOrderData }: { balanceTo: number | undefined, setisCountingDiscrepancy: any, changeData?: any, selectedDate: string | null | undefined, isCountingDiscrepancy: boolean | undefined, cashOrderData?: any }) {
    const [selectedValue, setSelectedValue] = useState<string>("")
    const [isError, setIsError] = useState<boolean>(false)
    const [isRecycleDiscrepancy, setIsRecycleDiscrepancy] = useState<boolean>(false)
    const [countDiscrepancyReason, setCountDiscrepancyReason] = useState<string>("")
    console.log(balanceTo);

    const { control, handleSubmit, watch, formState } = useForm<FormData>({
        defaultValues: {
            countedCash: Array(10).fill(''),
            recycledCash: Array(10).fill(''),
        },
        mode: 'all',
        reValidateMode: 'onChange'
    });
    const { errors, isDirty } = formState;
    const hasErrors = Object.keys(errors).length > 0;

    const countedCashValues = watch("countedCash");
    const recycledCashValues = watch("recycledCash");

    const noteTotal = countedCashValues.slice(0, 4).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const coinTotal = countedCashValues.slice(4).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const grandTotal = noteTotal + coinTotal;
    const recycledNoteTotal = recycledCashValues.slice(0, 4).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const recycledCoinTotal = recycledCashValues.slice(4).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const recycledGrandTotal = recycledNoteTotal + recycledCoinTotal;


    useEffect(() => {
        if (grandTotal === 0) {
            setisCountingDiscrepancy(undefined)
            return; // Exit the effect early if the grandTotal is zero
        }
        if (grandTotal !== balanceTo) {
            setisCountingDiscrepancy(true);
        } else {
            setisCountingDiscrepancy(false)
        }
    }, [grandTotal, balanceTo]);
    useEffect(() => {
        if (recycledGrandTotal > grandTotal) {
            setIsRecycleDiscrepancy(true)
        } else {
            setIsRecycleDiscrepancy(false);
        }
    }, [recycledGrandTotal, grandTotal])
    useEffect(() => {
        if (isRecycleDiscrepancy === true || hasErrors || isDirty) {
            setIsError(true)
        }
        setIsError(false)
    }, [isDirty, hasErrors, isRecycleDiscrepancy, selectedValue])

    const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
    };

    const onSubmit = (data: FormData) => {
        if (changeData) {
            const date = selectedDate;
            const client = changeData?.clientName;
            const bankedGrandTotal = grandTotal - recycledGrandTotal;
            const changeOrderId = changeData?.id;
            const bankedNotesTotal = noteTotal - recycledNoteTotal;
            const bankedCoinTotal = coinTotal - recycledCoinTotal;
            insertCashCount(
                data, date, client, bankedGrandTotal, noteTotal, coinTotal, grandTotal, recycledNoteTotal,
                recycledCoinTotal, recycledGrandTotal, changeOrderId, countDiscrepancyReason, bankedNotesTotal, bankedCoinTotal
            ).then(() => { window.location.href = '/cash-room'; });
        } else if (cashOrderData) {
            const date = selectedDate;
            const client = cashOrderData?.name;
            const cashOrderId = cashOrderData?.id;
            // console.log("cash order data:", data, date, client, noteTotal, coinTotal, grandTotal, cashOrderId, countDiscrepancyReason);
            insertCashOrderCount(data, date, client, noteTotal, coinTotal, grandTotal, cashOrderId, countDiscrepancyReason).then(() => {
                window.location.href = '/cash-room';
            });
        }
    };



    return (
        <div className="flex flex-col gap-4">
            {changeData &&
                <>
                    <ChangeOrderElement control={control} noteTotal={noteTotal} coinTotal={coinTotal} grandTotal={grandTotal} recycledNoteTotal={recycledNoteTotal} recycledCoinTotal={recycledCoinTotal} recycledGrandTotal={recycledGrandTotal} countedCashValues={countedCashValues} isRecycleDiscrepancy={isRecycleDiscrepancy} setSelectedValue={setSelectedValue} selectedValue={selectedValue} />
                    {(selectedValue.length > 0 && !isError) && <SubmitDialog isCountingDiscrepancy={isCountingDiscrepancy} changeData={changeData} handleFormSubmit={handleFormSubmit} balanceTo={balanceTo} recycledCoinTotal={recycledCoinTotal} recycledGrandTotal={recycledGrandTotal} recycledNoteTotal={recycledNoteTotal} coinTotal={coinTotal} noteTotal={noteTotal} grandTotal={grandTotal} countDiscrepancyReason={countDiscrepancyReason} setCountDiscrepancyReason={setCountDiscrepancyReason} />}
                </>
            }
            {cashOrderData &&
                <>
                    <p>Cash Order</p>
                    <CashOrderElement control={control} noteTotal={noteTotal} coinTotal={coinTotal} grandTotal={grandTotal} />
                    {!isError && <SubmitDialog isCountingDiscrepancy={isCountingDiscrepancy} changeData={changeData} handleFormSubmit={handleFormSubmit} balanceTo={balanceTo} recycledCoinTotal={recycledCoinTotal} recycledGrandTotal={recycledGrandTotal} recycledNoteTotal={recycledNoteTotal} coinTotal={coinTotal} noteTotal={noteTotal} grandTotal={grandTotal} countDiscrepancyReason={countDiscrepancyReason} setCountDiscrepancyReason={setCountDiscrepancyReason} />}
                </>
            }
        </div>
    )
}
function ChangeOrderElement({ control, noteTotal, coinTotal, grandTotal, recycledNoteTotal, recycledCoinTotal, recycledGrandTotal, countedCashValues, isRecycleDiscrepancy, setSelectedValue, selectedValue }: { control: any, noteTotal: number, coinTotal: number, grandTotal: number, recycledNoteTotal: number, recycledCoinTotal: number, recycledGrandTotal: number, countedCashValues: string[], isRecycleDiscrepancy: boolean, setSelectedValue: any, selectedValue: string }) {
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
                <RadioGroup className="flex" onValueChange={(e) => setSelectedValue(e)}>
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
function CashOrderElement({ control, noteTotal, coinTotal, grandTotal }: { control: any, noteTotal: number, coinTotal: number, grandTotal: number }) {
    return (
        <>
            <CashCountForm control={control} prefix="countedCash" noteTotal={noteTotal} coinTotal={coinTotal} grandTotal={grandTotal} />
        </>
    )
}
const RecycledCashForm = ({ control, prefix, coinTotal, noteTotal, grandTotal, countedCashValues }: { control: any, prefix: string, coinTotal: number, noteTotal: number, grandTotal: number, countedCashValues: string[] }) => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-10">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2">
                        {['$50', '$20', '$10', '$5'].map((amount, index) => (
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
                                    name={`recycledCash.${index + 4}`}
                                    control={control}
                                    rules={{
                                        validate: {
                                            multipleOfDenomination: (value) => {
                                                if (value === '') return true; // No error if the field is empty
                                                const numericValue = parseFloat(value);
                                                if (isNaN(numericValue)) return "Invalid number"; // Check if the value is a valid number
                                                const valueInCents = numericValue * 100; // Convert to cents
                                                // Validate both whole number for dollars and exact value for cents
                                                return (numericValue % (currencyValues[index + 4] / 100) === 0 ||
                                                    valueInCents % currencyValues[index + 4] === 0) ||
                                                    `Must be a multiple of ${currencyValues[index + 4] / 100}`;
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
                        {['$50', '$20', '$10', '$5'].map((amount, index) => (
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
                                    name={`countedCash.${index + 4}`}
                                    control={control}
                                    rules={{
                                        validate: {
                                            multipleOfDenomination: (value) => {
                                                if (value === '') return true; // No error if the field is empty
                                                const numericValue = parseFloat(value);
                                                if (isNaN(numericValue)) return "Invalid number"; // Check if the value is a valid number
                                                const valueInCents = numericValue * 100; // Convert to cents
                                                // Validate both whole number for dollars and exact value for cents
                                                return (numericValue % (currencyValues[index + 4] / 100) === 0 ||
                                                    valueInCents % currencyValues[index + 4] === 0) ||
                                                    `Must be a multiple of ${currencyValues[index + 4] / 100}`;
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
function SubmitDialog({ balanceTo, recycledCoinTotal, recycledNoteTotal, recycledGrandTotal, noteTotal, coinTotal, grandTotal, handleFormSubmit, changeData, isCountingDiscrepancy, countDiscrepancyReason, setCountDiscrepancyReason }: { balanceTo: number | undefined, recycledCoinTotal: number, recycledNoteTotal: number, recycledGrandTotal: number, noteTotal: number, coinTotal: number, grandTotal: number, handleFormSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void, changeData: any, isCountingDiscrepancy: boolean | undefined, countDiscrepancyReason: string, setCountDiscrepancyReason: any }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Submit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Review count for {changeData?.clientName}</DialogTitle>
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
                        <div className="font-bold col-span-2 text-left">Order Value</div>
                        <div>-</div>
                        <div>-</div>
                        <div>{formatNumber(balanceTo)}</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-center py-2">
                        <div className="font-bold col-span-2 text-left">Counted </div>
                        <div>{formatNumber(coinTotal)}</div>
                        <div>{formatNumber(noteTotal)}</div>
                        <div>{formatNumber(grandTotal)}</div>
                    </div>
                    {changeData &&
                        <>
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
                        </>}
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

