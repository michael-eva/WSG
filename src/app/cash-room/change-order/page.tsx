'use client'
import { Button } from "@/components/ui/button"
import PlaceOrder from "./place-order"
import OrderHistory from "./order-history"
import { CalendarDaysIcon } from "@/components/ui/icons"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { SetStateAction, useCallback, useEffect, useState } from "react"
import { supabase } from "@/utils/supabaseClient"
import { getClients } from "./utils"
import { ChangeOrderData } from "@/app/types"
import { useRouter, useSearchParams } from "next/navigation"
type client = {
    name: string
}
type Run = {
    id: number;
    name: string;

}
export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [changeOrderData, setChangeOrderData] = useState<ChangeOrderData[] | undefined>()
    const [selectedDate, setSelectedDate] = useState<string | null>(searchParams.get('date'));
    const [selectedClient, setSelectedClient] = useState<string | null>(searchParams.get('client'));
    const [selectedStatus, setSelectedStatus] = useState<string | null>(searchParams.get('status'));
    const [isFilter, setIsFilter] = useState(false);
    const [clients, setClients] = useState<client[]>([]);
    const [runs, setRuns] = useState<Run[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [orderType, setOrderType] = useState<"cashOrder" | "changeOrder">();

    useEffect(() => {
        if (selectedClient || selectedDate || selectedStatus || selectedClient === 'all' || selectedStatus === 'all') {
            setIsFilter(true);
        } else {
            setIsFilter(false);
        }
        fetchData();
        updateUrlParams();
    }, [selectedClient, selectedStatus, selectedDate]);
    // use effect to fetch clients and set the clients state to the data
    useEffect(() => {
        const fetchClients = async () => {
            const data = await getClients();
            if (data) {
                setClients(data);
            } else {
                // Handle the case where data is null due to an error
                setClients([]);
            }
        };
        const fetchRuns = async () => {
            const { data, error } = await supabase
                .from('runs')
                .select('id, name');
            if (error) {
                console.error('Error fetching runs:', error);
            } else {
                setRuns(data as Run[]);
            }
        }
        fetchClients();
        fetchRuns();
    }, []);
    const fetchData = async () => {
        let query = supabase
            .from('change-order')
            .select('*')
            .order('created_at', { ascending: false });

        if (selectedClient && selectedClient !== 'all') {
            query = query.eq('clientName', selectedClient);
        }
        if (selectedStatus && selectedStatus !== 'all') {
            query = query.eq('status', selectedStatus);
        }
        if (selectedDate) {
            query = query.eq('deliveryDate', selectedDate);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            // Custom sorting function
            const statusOrder = ['pending_eft_processing', 'unprocessed', "packed", "pending count", 'dispatched', 'processed',];
            const sortedData = data.sort((a, b) => {
                const statusA = statusOrder.indexOf(a.status);
                const statusB = statusOrder.indexOf(b.status);
                if (statusA === statusB) {
                    // If statuses are the same, maintain the original order by deliveryDate
                    return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
                }
                return statusA - statusB;
            });

            setChangeOrderData(sortedData);
        }
    };
    const handleDateSelect = (newDate: any) => {
        const formattedDate = newDate.toLocaleDateString('en-AU')
        setSelectedDate(formattedDate);

    };
    const handleClientChange = (e: SetStateAction<string | null>) => {
        setSelectedClient(e);
    };
    const handleStatusChange = (event: SetStateAction<string | null>) => {
        setSelectedStatus(event);
    };
    const updateUrlParams = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedDate) params.set('date', selectedDate);
        else params.delete('date');

        if (selectedClient && selectedClient !== 'all') params.set('client', selectedClient);
        else params.delete('client');

        if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);
        else params.delete('status');

        router.push(`?${params.toString()}`, { scroll: false });
    }, [searchParams, selectedDate, selectedClient, selectedStatus, router]);

    function clearFilters() {
        setSelectedClient(null);
        setSelectedDate(null);
        setSelectedStatus(null);
    }
    return (
        <div>
            <div className="">
                <header className="flex justify-between gap-6">
                    <h1>Change Order</h1>
                    <div className="flex space-x-4 w-[550px] justify-center">
                        <div className="w-1/3">
                            <Select onValueChange={(e) => handleClientChange(e)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={selectedClient ? selectedClient : "Select Client"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients?.map((client, id) => (
                                        <SelectItem key={id} value={client.name}>{client.name}</SelectItem>
                                    ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="relative w-1/3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    {/* @ts-ignore */}
                                    <Button className="w-full font-normal" variant="outline" value={selectedDate}>
                                        <CalendarDaysIcon className="mr-3 h-4 w-4" />
                                        {selectedDate ? selectedDate : 'Select Date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-auto p-0">
                                    <Calendar initialFocus mode="single" onSelect={handleDateSelect} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="w-1/3">
                            <Select onValueChange={(event) => handleStatusChange(event)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={selectedStatus ? selectedStatus : "Select Status"} />
                                </SelectTrigger>
                                <SelectContent className="">
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="unprocessed">Unprocessed</SelectItem>
                                    <SelectItem value="packed">Packed</SelectItem>
                                    <SelectItem value="dispatched">Dispatched</SelectItem>
                                    <SelectItem value="pending count">Pending Count</SelectItem>
                                    <SelectItem value="processed">Processed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {isFilter &&
                        <Button
                            variant="outline"
                            className="border border-red-500 text-red-500 hover:bg-red-800 hover:text-white hover:border-red-800"
                            onClick={() => clearFilters()}
                        >Clear Filters
                        </Button>}
                    <div className="flex gap-5">
                        <Button onClick={() => { setIsOpen(!isOpen), setOrderType("changeOrder") }} >Enter Change Order</Button>
                        <Button onClick={() => { setIsOpen(!isOpen), setOrderType("cashOrder") }}>Place Cash Order</Button>
                    </div>
                </header>
                <Separator className="mb-8" />
                <OrderHistory changeOrderData={changeOrderData} fetchData={fetchData} />
            </div>
            {isOpen && <Dialog setIsOpen={setIsOpen}>
                <PlaceOrder type={orderType} clients={clients} runs={runs} fetchData={fetchData} />
            </Dialog>}
        </div>
    )
}
function Dialog({ setIsOpen, children }: { setIsOpen: any, children: any }) {
    const closeDialog = () => setIsOpen(false);
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[60vw]">
                <div className="flex justify-end">
                    <div
                        onClick={closeDialog}
                        className="px-2 border rounded border-transparent cursor-pointer hover:border-gray-500"
                    >
                        X
                    </div>
                </div>
                {children}
                <div className="flex justify-end gap-2">

                </div>
            </div>
        </div>
    )
}