import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon } from "@/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getClients } from "./utils";
import { supabase } from "@/utils/supabaseClient";
import { useUrlParams } from './UrlParamsContext';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { TableHead, TableHeader, Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatNumber, getDate } from "@/utils/utils";

type DepositBagData = {
    id: string,
    clientNames: string[],
    value: number,
    bagId: string,
    status: string,
    created_at: Date,
    dateReceived: Date
}

type ClientData = {
    name: string
}

export default function BankingHistory() {
    const { urlParams, updateUrlParams, clearUrlParams }: any = useUrlParams();
    const [clients, setClients] = useState<ClientData[]>();
    const [selectedClient, setSelectedClient] = useState(urlParams.get('bankingHistory-client') || 'all');
    const [selectedDateCounted, setSelectedDateCounted] = useState(urlParams.get('bankingHistory-dateCounted') || '');
    const [selectedDateBanked, setSelectedDateBanked] = useState(urlParams.get('bankingHistory-dateBanked') || '');
    const [selectedStatus, setSelectedStatus] = useState(urlParams.get('bankingHistory-status') || 'all');
    const [bagNumber, setBagNumber] = useState(urlParams.get('bankingHistory-bagnumber') || '');
    const [debouncedBagNumber, setDebouncedBagNumber] = useState(bagNumber);
    const [depositBagData, setDepositBagData] = useState<DepositBagData[]>();
    const [isFilter, setIsFilter] = useState<boolean>(false);

    useEffect(() => {
        const fetchClients = async () => {
            const data = await getClients();
            setClients(data || []);
        };
        fetchClients();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedBagNumber(bagNumber);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [bagNumber]);

    useEffect(() => {
        const fetchData = async () => {
            let query = supabase.from('deposit-bag').select('*');
            if (selectedClient && selectedClient !== 'all') {
                query = query.contains('clientNames', [selectedClient]);
            }

            if (selectedStatus && selectedStatus !== 'all') {
                query = query.eq('status', selectedStatus);
            }
            if (selectedDateCounted) {
                query = query.eq('countDate', selectedDateCounted);
            }
            if (selectedDateBanked) {
                query = query.eq('bankDate', selectedDateBanked);
            }
            if (debouncedBagNumber) {
                query = query.ilike('bagId', `%${debouncedBagNumber}%`);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setDepositBagData(data);
            }
        };

        setIsFilter(
            selectedClient !== 'all' ||
            selectedDateCounted !== '' ||
            selectedDateBanked !== '' ||
            selectedStatus !== 'all' ||
            debouncedBagNumber !== ''
        );

        fetchData();
        updateUrlParams('bankingHistory-client', selectedClient !== 'all' ? selectedClient : null);
        updateUrlParams('bankingHistory-dateCounted', selectedDateCounted || null);
        updateUrlParams('bankingHistory-dateBanked', selectedDateBanked || null);
        updateUrlParams('bankingHistory-bagnumber', debouncedBagNumber || null);
        updateUrlParams('bankingHistory-status', selectedStatus !== 'all' ? selectedStatus : null);
    }, [selectedClient, selectedStatus, selectedDateBanked, selectedDateCounted, debouncedBagNumber, updateUrlParams]);

    const handleClientChange = (e: string) => {
        setSelectedClient(e);
        updateUrlParams('bankingHistory-client', e !== 'all' ? e : null);
    };

    const handleCountDateSelect = (newDate: any) => {
        const formattedDate = newDate.toLocaleDateString('en-AU');
        setSelectedDateCounted(formattedDate);
        updateUrlParams('bankingHistory-dateCounted', formattedDate);
    };

    const handleBankDateSelect = (newDate: any) => {
        const formattedDate = newDate.toLocaleDateString('en-AU');
        setSelectedDateBanked(formattedDate);
        updateUrlParams('bankingHistory-dateBanked', formattedDate);
    };

    const handleStatusChange = (event: string) => {
        setSelectedStatus(event);
        updateUrlParams('bankingHistory-status', event !== 'all' ? event : null);
    };
    const handleBagNumberChange = (event: string) => {
        setBagNumber(event);
    };

    const clearFilters = () => {
        setSelectedClient('all');
        setSelectedDateBanked('');
        setSelectedDateCounted('');
        setSelectedStatus('all');
        setBagNumber('');
        clearUrlParams('bankingHistory-');

        // Log clear filters
        console.log("clearFilters triggered");
    };


    return (
        <>
            <div>
                <h1>Banking History:</h1>
                <div className="space-y-5">
                    <div className="grid grid-cols-4 gap-2">
                        <div>
                            <Label>Clients</Label>
                            <Select onValueChange={handleClientChange} value={selectedClient}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Client" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {clients?.map((client, id) => (
                                        <SelectItem key={id} value={client.name}>{client.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* <div>
                            <Label>Date Counted</Label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="w-full flex justify-start" variant="outline">
                                        {selectedDateCounted || 'Select Date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-auto p-0">
                                    <Calendar initialFocus mode="single" onSelect={handleCountDateSelect} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label>Date Banked</Label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="w-full flex justify-start" variant="outline">
                                        {selectedDateBanked || 'Select Date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-auto p-0">
                                    <Calendar initialFocus mode="single" onSelect={handleBankDateSelect} />
                                </PopoverContent>
                            </Popover>
                        </div> */}
                        <div>
                            <Label>Status</Label>
                            <Select onValueChange={handleStatusChange} value={selectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="awaiting deposit">Awaiting Deposit</SelectItem>
                                    <SelectItem value="packed">Packed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Bag Number</Label>
                            <Input
                                value={bagNumber}
                                onChange={(e) => handleBagNumberChange(e.target.value)}
                                placeholder="Bag Number"
                            />
                        </div>
                        {isFilter && (
                            <Button
                                variant="outline"
                                className="border border-red-500 text-red-500 hover:bg-red-800 hover:text-white hover:border-red-800"
                                onClick={clearFilters}
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto max-h-[400px]">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-100 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-4 py-3 text-left">Client Names</th>
                                    <th className="px-4 py-3 text-left">Date Packed</th>
                                    <th className="px-4 py-3 text-left">Date Received</th>
                                    <th className="px-4 py-3 text-left">Value</th>
                                    <th className="px-4 py-3 text-left">Bag Number</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {depositBagData?.length ? depositBagData.map((item, id) => (
                                    console.log(item),

                                    <tr key={id}>
                                        <td className="px-4 py-3"><ClientNames clients={item.clientNames} /></td>
                                        <td className="px-4 py-3">{getDate(item.created_at)}</td>
                                        <td className="px-4 py-3">{item?.dateReceived ? getDate(item.dateReceived) : "-"}</td>
                                        <td className="px-4 py-3">{formatNumber(item.value)}</td>
                                        <td className="px-4 py-3 text-right">{item.bagId}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={`${item?.status === "deposited" ? "text-green-500 border-green-500" : "text-orange-500 border-orange-500"}`}>{item?.status}</Badge>
                                        </td>
                                    </tr>
                                )) : <tr>
                                    <td className="px-4 py-3 text-center text-xl" colSpan={5}>No data found</td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

function ClientNames({ clients }: { clients: string[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {clients.length === 1 ? <p className="cursor-pointer">{clients[0]}</p> :
                    <Button variant="outline">
                        See {clients.length} clients
                    </Button>}

            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Client Names</DialogTitle>
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100 text-gray-600 font-medium">
                            <tr>
                                <th className="px-4 py-3 text-left">Client Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clients.map((client, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3">{client}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
