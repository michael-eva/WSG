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
import { formatNumber, getDate } from "@/utils/utils";

type BankingData = {
    id: string,
    grandTotal: number,
    status: string,
    clientName: string,
    countDate: string,
    bankDate: string
}

type ClientData = {
    name: string
}

export default function AwaitingBanking() {
    const { urlParams, updateUrlParams, clearUrlParams }: any = useUrlParams();
    const [clients, setClients] = useState<ClientData[]>([]);
    const [selectedClient, setSelectedClient] = useState(urlParams.get('awaitingBanking-client') || 'all');
    const [selectedDateCounted, setSelectedDateCounted] = useState(urlParams.get('awaitingBanking-dateCounted') || '');
    const [selectedDateBanked, setSelectedDateBanked] = useState(urlParams.get('awaitingBanking-dateBanked') || '');
    const [selectedStatus, setSelectedStatus] = useState(urlParams.get('awaitingBanking-status') || 'all');
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [bankingData, setBankingData] = useState<BankingData[]>([]);

    // Log initial state
    console.log("Initial state:", {
        selectedClient,
        selectedDateCounted,
        selectedDateBanked,
        selectedStatus
    });

    useEffect(() => {
        const fetchClients = async () => {
            const data = await getClients();
            setClients(data || []);
        };
        fetchClients();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            let query = supabase.from('banking').select('*');
            if (selectedClient && selectedClient !== 'all') {
                query = query.eq('clientName', selectedClient);
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

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setBankingData(data || []);
            }
        };

        fetchData();
        updateUrlParams('awaitingBanking-client', selectedClient !== 'all' ? selectedClient : null);
        updateUrlParams('awaitingBanking-dateCounted', selectedDateCounted || null);
        updateUrlParams('awaitingBanking-dateBanked', selectedDateBanked || null);
        updateUrlParams('awaitingBanking-status', selectedStatus !== 'all' ? selectedStatus : null);

        // Determine if any filter is applied
        setIsFilter(selectedClient !== 'all' || selectedDateCounted || selectedDateBanked || selectedStatus !== 'all');

        // Log state changes
        console.log("State changes:", {
            selectedClient,
            selectedDateCounted,
            selectedDateBanked,
            selectedStatus
        });

    }, [selectedClient, selectedStatus, selectedDateBanked, selectedDateCounted, updateUrlParams]);

    const handleClientChange = (e: string) => {
        setSelectedClient(e);
        updateUrlParams('awaitingBanking-client', e !== 'all' ? e : null);
        console.log("handleClientChange:", e);
    };

    const handleCountDateSelect = (newDate: any) => {
        const formattedDate = newDate.toLocaleDateString('en-AU');
        setSelectedDateCounted(formattedDate);
        updateUrlParams('awaitingBanking-dateCounted', formattedDate);
        console.log("handleCountDateSelect:", formattedDate);
    };

    const handleBankDateSelect = (newDate: any) => {
        const formattedDate = newDate.toLocaleDateString('en-AU');
        setSelectedDateBanked(formattedDate);
        updateUrlParams('awaitingBanking-dateBanked', formattedDate);
        console.log("handleBankDateSelect:", formattedDate);
    };

    const handleStatusChange = (event: string) => {
        setSelectedStatus(event);
        updateUrlParams('awaitingBanking-status', event !== 'all' ? event : null);
        console.log("handleStatusChange:", event);
    };

    const clearFilters = () => {
        setSelectedClient('all');
        setSelectedDateBanked('');
        setSelectedDateCounted('');
        setSelectedStatus('all');
        clearUrlParams('awaitingBanking-');

        // Log clear filters
        console.log("clearFilters triggered");
    };

    return (
        <div>
            <h1>Awaiting Banking:</h1>
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
                                {clients.map((client, id) => (
                                    <SelectItem key={id} value={client.name}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Date Counted</Label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="w-full flex justify-start" variant="outline">
                                    {/* <CalendarDaysIcon className="ml-2 h-4 w-4" /> */}
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
                                    {/* <CalendarDaysIcon className="ml-2 h-4 w-4" /> */}
                                    {selectedDateBanked || 'Select Date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-auto p-0">
                                <Calendar initialFocus mode="single" onSelect={handleBankDateSelect} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select onValueChange={handleStatusChange} value={selectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="awaiting banking">Awaiting Banking</SelectItem>
                                <SelectItem value="packed">Packed</SelectItem>
                            </SelectContent>
                        </Select>
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
                    <table className="w-full table-auto ">
                        <thead className="bg-gray-100 text-gray-600 font-medium">
                            <tr>
                                <th className="px-4 py-3 text-left">Client</th>
                                <th className="px-4 py-3 text-left">Date Counted</th>
                                <th className="px-4 py-3 text-left">Date Banked</th>
                                <th className="px-4 py-3 text-left">Value</th>
                                <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bankingData.length ? bankingData.map((item, id) => (
                                <tr key={id}>
                                    <td className="px-4 py-3">{item.clientName}</td>
                                    <td className="px-4 py-3">{getDate(item.countDate)}</td>
                                    <td className="px-4 py-3">{item.bankDate}</td>
                                    <td className="px-4 py-3">{formatNumber(item.grandTotal)}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className={`${item.status === "deposited" ? "text-green-500 border-green-500" : "text-orange-500 border-orange-500"}`}>{item.status}</Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td className="px-4 py-3 text-center text-xl" colSpan={5}>No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
