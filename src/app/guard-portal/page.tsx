'use client'
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MultiValue, default as ReactSelect } from 'react-select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDaysIcon } from "@/components/ui/icons";
import { Calendar } from "@/components/ui/calendar";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateChangeOrderStatus } from "./utils";
import { getDate } from "@/utils/utils";
type GuardDetails = {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
};
type Run = {
    id: number;
    name: string;
};
type ChangeOrder = {
    id: number;
    clientName: string;
    grandTotal: number;
}
type OptionType = {
    value: number;
    label: string;
};

export default function Page() {
    const [guards, setGuards] = useState<GuardDetails[]>([]);
    const [runs, setRuns] = useState<Run[]>([]);

    useEffect(() => {
        getGuards();
        getRuns();
    }, [])



    const getGuards = async () => {
        const { data, error } = await supabase
            .from('guard-details')
            .select('id, firstName, lastName, fullName'); // Ensure 'id' is included in the selection

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setGuards(data as GuardDetails[]);
        }
    };
    const getRuns = async () => {
        const { data, error } = await supabase
            .from('runs')
            .select('id, name'); // Ensure 'id' is included in the selection

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setRuns(data)
        }
    };




    return (
        <div className="grid grid-cols-3 gap-5">
            <OutgoingOrders />
            <div className="col-span-2">

                <ReturningCashSwap />
                <BankingDeposits />
            </div>

        </div>
    )
    function OutgoingOrders() {
        const [selectedRun, setSelectedRun] = useState<Run | undefined>(undefined);
        const [selectedGuard, setSelectedGuard] = useState<string | null>("");
        const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
        const [selectedChangeOrderIds, setSelectedChangeOrderIds] = useState<number[]>([]);
        const [selectedDate, setSelectedDate] = useState<string | null>(getDate(new Date()));


        useEffect(() => {
            getChangeOrders()
        }, [selectedRun, selectedDate])
        const getChangeOrders = async () => {
            const { data, error } = await supabase
                .from('change-order')
                .select('id, clientName, grandTotal')
                .eq('run', selectedRun?.name)
                .eq('status', 'packed')
                .eq('deliveryDate', selectedDate)

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setChangeOrders(data)
            }
        }
        const handleSelect = (e: string | null) => {
            const selectedRunObject: Run | undefined = runs.find((run) => run.name === e);
            setSelectedRun(selectedRunObject);
        };
        const handleChangeOrderSelect = (selectedOptions: MultiValue<OptionType>) => {
            const ids = selectedOptions.map(option => option.value);
            setSelectedChangeOrderIds(ids);
        };
        const handleSubmit = async () => {
            console.log("submitted");
            if (selectedChangeOrderIds.length > 0) {
                await updateChangeOrderStatus(selectedGuard, selectedChangeOrderIds);
            }
            window.location.reload()
        }
        return (
            <div>
                <Card className="w-[350px] bg-blue-200">
                    <CardHeader>
                        <CardTitle>Outgoing Orders</CardTitle>
                        <CardDescription>Change orders to be delivered.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="guardName">Select Name</Label>
                                    <ReactSelect
                                        isClearable={true}
                                        isSearchable={true}
                                        name="guardName"
                                        options={guards.map((guard) => ({ value: guard.fullName, label: guard.fullName }))}
                                        value={selectedGuard ? { value: selectedGuard, label: selectedGuard } : null}
                                        onChange={(selectedOption) => setSelectedGuard(selectedOption && selectedOption!.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="date">Select Date</Label>
                                    <Popover>
                                        <div>
                                            <PopoverTrigger asChild>
                                                <Button className="w-full" variant="outline">
                                                    {selectedDate}
                                                    <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align="start" className="w-auto p-0">
                                                <Calendar initialFocus mode="single" onSelect={(e) => setSelectedDate(getDate(e!))} />
                                            </PopoverContent>
                                        </div>
                                    </Popover>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="run">Select Run</Label>
                                    <ReactSelect
                                        isClearable={true}
                                        isSearchable={true}
                                        name="run"
                                        options={runs.map((run) => ({ value: run.name, label: run.name }))}
                                        value={selectedRun ? { value: selectedRun.name, label: selectedRun.name } : null}
                                        onChange={(selectedOption) => handleSelect(selectedOption ? selectedOption.value : null)}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="run">Select Change Order</Label>
                                    <ReactSelect
                                        defaultValue={"Selectass"}
                                        isMulti={true}
                                        name="colors"
                                        // @ts-ignore
                                        options={changeOrders.map((changeOrder) => ({
                                            value: changeOrder.id,
                                            label: changeOrder.clientName,
                                        }))}
                                        //@ts-ignore
                                        onChange={(selectedOption) => handleChangeOrderSelect(selectedOption)}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }
    function ReturningCashSwap() {
        const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toLocaleDateString('en-AU'));
        const [selectedGuard, setSelectedGuard] = useState<string | null>("");
        const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
        const [cashSwaps, setCashSwaps] = useState<{ [key: number]: number }>({});
        const [errors, setErrors] = useState<{ [key: number]: string }>({});
        const [discrepancies, setDiscrepancies] = useState<{ [key: number]: string }>({});
        const [formError, setFormError] = useState<string | null>(null);

        const handleCashSwapChange = (id: number, value: number) => {
            const order = changeOrders.find(order => order.id === id);
            if (order) {
                if (value !== order.grandTotal) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [id]: `Value must be ${order.grandTotal.toFixed(2)}`,
                    }));
                } else {
                    setErrors((prevErrors) => {
                        const { [id]: _, ...rest } = prevErrors;
                        return rest;
                    });
                }
                setCashSwaps((prevSwaps) => ({
                    ...prevSwaps,
                    [id]: value,
                }));
            }
        };
        const handleDiscrepancyChange = (id: number, value: string) => {
            setDiscrepancies((prevDiscrepancies) => ({
                ...prevDiscrepancies,
                [id]: value,
            }));
        };
        useEffect(() => {
            getChangeOrders()
        }, [selectedGuard, selectedDate])
        async function getChangeOrders() {
            const { data, error } = await supabase
                .from('change-order')
                .select('id, clientName, grandTotal')
                .eq('guard', selectedGuard)
                .eq('status', 'dispatched')
                .eq('deliveryDate', selectedDate)

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setChangeOrders(data)
            }
        }
        const handleSubmit = async () => {
            setFormError(null);
            let valid = true;
            const updates = changeOrders.map((order) => {
                const cashSwap = cashSwaps[order.id];
                const hasDiscrepancy = !!errors[order.id];

                if (hasDiscrepancy && !discrepancies[order.id]) {
                    valid = false;
                }

                return {
                    id: order.id,
                    status: 'pending count',
                    secondaryStatus: hasDiscrepancy ? 'guard discrepancy' : undefined,
                    guardReturnValue: cashSwap,
                    guardDiscrepancyReason: hasDiscrepancy ? discrepancies[order.id] : undefined,
                };
            });

            if (!valid) {
                setFormError('Please fill out all required discrepancy reasons.');
                return;
            }

            const { data, error } = await supabase.from('change-order').upsert(updates)

            if (error) {
                console.error('Error updating data:', error);
            } else {
                console.log('Data updated successfully:', data);
            }
            window.location.reload()
        };
        return (
            <div>
                <Card className=" bg-green-200 w-[830px]">
                    <CardHeader>
                        <CardTitle>Returning Cash Swaps</CardTitle>
                        <CardDescription>Cash swaps returned.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex gap-4">
                                    <div className=" w-1/2 flex flex-col space-y-1.5">
                                        <Label htmlFor="guardName">Select Name</Label>
                                        <ReactSelect
                                            isClearable={true}
                                            isSearchable={true}
                                            name="guardName"
                                            options={guards.map((guard) => ({ value: guard.fullName, label: guard.fullName }))}
                                            value={selectedGuard ? { value: selectedGuard, label: selectedGuard } : null}
                                            onChange={(selectedOption) => setSelectedGuard(selectedOption!.value)}
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col space-y-1.5">
                                        <Label htmlFor="date">Select Date</Label>
                                        <Popover>
                                            <div>
                                                <PopoverTrigger asChild>
                                                    <Button className="w-full" variant="outline">
                                                        {selectedDate}
                                                        <CalendarDaysIcon className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-auto p-0">
                                                    <Calendar initialFocus mode="single" onSelect={(e) => setSelectedDate(e!.toLocaleDateString('en-AU'))} />
                                                </PopoverContent>
                                            </div>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    {changeOrders.length > 0 &&
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[200px]">Customer</TableHead>
                                                    <TableHead>Packed Value</TableHead>
                                                    <TableHead className="text-center">Cash Swap</TableHead>
                                                    <TableHead className="text-center">Reason for discrepancy</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {changeOrders?.map((order, id) => (
                                                    <TableRow key={id}>
                                                        <TableCell className="font-medium">{order?.clientName}</TableCell>
                                                        <TableCell className="text-center">${order?.grandTotal.toFixed(2)}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Input
                                                                type="number"
                                                                value={cashSwaps[order.id] ? cashSwaps[order.id] : ""}
                                                                placeholder="Enter Cash Swap"
                                                                onChange={(e) => handleCashSwapChange(order.id, Number(e.target.value))}
                                                            />
                                                            {errors[order.id] && <p className="text-red-500">{errors[order.id]}</p>}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Textarea
                                                                placeholder="Type your message here."
                                                                value={discrepancies[order.id] ?? ""}
                                                                onChange={(e) => handleDiscrepancyChange(order.id, e.target.value)}
                                                                disabled={!errors[order.id]}
                                                                required={true}
                                                            />
                                                            {formError && <p className="text-red-500">{formError}</p>}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    }
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }
    function BankingDeposits() {
        return (
            <h1>Banking deposits</h1>
        )
    }
}
