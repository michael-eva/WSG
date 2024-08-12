'use client'
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "@/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { getClients } from "../utils";
import Select from 'react-select'
import { Label } from "@/components/ui/label";
import { changePaymentStatus, getAllClientsTransactions } from "./utils";
import Table from "./table";

type Clients = {
    name: string,
}
type CashCount = {
    id: number;
    cashOrderId: number | null;
    changeOrderId: number | null;
    clientName: string;
    coinTotal: number;
    countDate: Date;
    countDiscrepancyReason: string;
    created_at: string;
    fifty: number;
    fiftyC: number;
    five: number;
    fiveC: number;
    grandTotal: number;
    hundred: number;
    cashCountId: number;
    noteTotal: number;
    one: number;
    status: string;
    ten: number;
    tenC: number;
    twenty: number;
    twentyC: number;
    two: number;
};


export default function Page() {
    const [clients, setClients] = useState<Clients[]>([])
    const [clientTransactions, setClientTransactions] = useState<CashCount[]>([]);
    const [selectedClients, setSelectedClients] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedPayments, setSelectedPayments] = useState<CashCount[]>([])
    const isFiltered = selectedClients.length > 0 || selectedStatus || selectedDate;

    useEffect(() => {
        getClients().then((data) => {
            setClients(data);
        });
        // Parse URL parameters and set initial state
        const params = new URLSearchParams(window.location.search);
        const clientsParam = params.get('clients');
        const statusParam = params.get('status');
        const dateProcessedParam = params.get('dateProcessed');

        if (clientsParam) {
            const clientNames = clientsParam.split(',');
            setSelectedClients(clientNames.map(name => ({ value: name, label: name })));
        }

        if (statusParam) {
            setSelectedStatus({ value: statusParam, label: statusParam.charAt(0).toUpperCase() + statusParam.slice(1) });
        }

        if (dateProcessedParam) {
            setSelectedDate(new Date(dateProcessedParam));
        }
    }, []);
    useEffect(() => {
        fetchFilteredTransactions();
    }, [selectedClients, selectedStatus, selectedDate]);
    const fetchFilteredTransactions = () => {
        const clientNames = selectedClients.map(client => client.value);
        const status = selectedStatus ? selectedStatus.value : '';
        const dateProcessed = selectedDate ? selectedDate.toISOString().split('T')[0] : '';

        getAllClientsTransactions(clientNames, status, dateProcessed).then((data) => {
            setClientTransactions(data);
        }).catch((error) => {
            console.error('Error fetching filtered transactions:', error);
        });
    };

    const handleClientChange = (selectedOptions: any) => {
        setSelectedClients(selectedOptions);
        const clientNames = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        updateSearchParams('clients', clientNames.join(','));
    };

    const handleStatusChange = (selectedOption: any) => {
        setSelectedStatus(selectedOption);
        const status = selectedOption ? selectedOption.value : '';
        updateSearchParams('status', status);
    };

    const handleDateChange = (key: string, date: Date | undefined) => {
        setSelectedDate(date);
        const formattedDate = date ? date.toLocaleDateString('en-AU') : '';
        updateSearchParams(key, formattedDate);
    };

    const updateSearchParams = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };
    const handleCheckboxChange = (client: CashCount) => {
        setSelectedPayments(prevSelected => {
            if (prevSelected.find(item => item.id === client.id)) {
                return prevSelected.filter(item => item.id !== client.id);
            } else {
                return [...prevSelected, client];
            }
        });
    };
    const handleSubmit = async () => {
        for (const payment of selectedPayments) {
            const newStatus = payment.status === "client payable" ? "paid" : "client payable"
            await changePaymentStatus(payment, newStatus).then(() => fetchFilteredTransactions()).finally(() => setSelectedPayments([]))
        }

    }
    const clearFilters = () => {
        setSelectedClients([])
        setSelectedStatus(null)
        setSelectedDate(undefined)
    }

    return (
        <div>
            <div className="flex justify-evenly items-end gap-2 py-4">
                <div>
                    <Label>Client Name</Label>
                    <Select
                        options={clients.map((client) => ({ value: client.name, label: client.name }))}
                        isMulti
                        isClearable
                        isSearchable
                        value={selectedClients}
                        onChange={handleClientChange}
                    />
                </div>
                <div>
                    <Label>Date Processed</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full text-gray-500" variant="outline" >
                                {selectedDate?.toLocaleDateString('en-AU') || "Date Processed"}
                                <CalendarDaysIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0" >
                            <Calendar
                                initialFocus
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => handleDateChange('dateProcessed', date)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label>Status</Label>
                    <Select
                        options={[{ value: 'client payable', label: 'Payable' }, { value: 'paid', label: 'Paid' }, { value: 'awaiting banking', label: 'Awaiting banking' }]}
                        isClearable
                        value={selectedStatus}
                        onChange={handleStatusChange}
                    />
                </div>

                <div className="w-[120px] flex items-end"> {/* Adjust width as needed */}
                    {isFiltered ? (
                        <Button className="hover:bg-red-300 bg-red-500" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    ) : (
                        <div className="invisible">Placeholder</div>
                    )}
                </div>

            </div>
            <Table clientTransactions={clientTransactions} handleCheckboxChange={handleCheckboxChange} />
            <div className="flex justify-end mt-4">
                <Button
                    disabled={selectedPayments.length === 0}
                    onClick={() => handleSubmit()}
                >Submit</Button>
            </div>

        </div>
    )
}
