import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { CalendarDaysIcon, ChevronDownIcon } from "@/components/ui/icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatNumber, getDate } from "@/utils/utils"
type BankDeposit = {
    value: number,
    bagId: string,
    status?: string,
    created_at: Date,
    dateReceived: Date
}
export default function BankingHistory({ handleCheckboxChange, pendingBankDeposit, setSelectedItems }: any) {
    const onCheckboxChange = (item: { value?: number; bagId: any; status?: string | undefined; created_at?: Date; dateReceived?: Date }) => {
        handleCheckboxChange(item);
        setSelectedItems((prevItems: any[]) => {
            if (prevItems.includes(item.bagId)) {
                return prevItems.filter(id => id !== item.bagId);
            } else {
                return [...prevItems, item.bagId];
            }
        });
    };
    return (
        <div>
            <div className=" space-y-5">
                <div className="grid grid-cols-4 gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-full" variant="outline">
                                Client Name
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                            <DropdownMenuItem>John Doe</DropdownMenuItem>
                            <DropdownMenuItem>Jane Smith</DropdownMenuItem>
                            <DropdownMenuItem>Bob Johnson</DropdownMenuItem>
                            <DropdownMenuItem>Sarah Lee</DropdownMenuItem>
                            <DropdownMenuItem>Tom Wilson</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full" variant="outline">
                                Date Received
                                <CalendarDaysIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar initialFocus mode="single" />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="w-full" variant="outline">
                                Date Banked
                                <CalendarDaysIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar initialFocus mode="single" />
                        </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-full" variant="outline">
                                Status
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-full">
                            <DropdownMenuItem>Run 1</DropdownMenuItem>
                            <DropdownMenuItem>Run 2</DropdownMenuItem>
                            <DropdownMenuItem>Run 3</DropdownMenuItem>
                            <DropdownMenuItem>Run 4</DropdownMenuItem>
                            <DropdownMenuItem>Run 5</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto max-h-[400px]">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100 text-gray-600 font-medium">
                            <tr>
                                <th className="px-4 py-3 text-left">Received?</th>
                                <th className="px-4 py-3 text-left">Bag ID</th>
                                <th className="px-4 py-3 text-left">Date Receieved</th>
                                <th className="px-4 py-3 text-left">Date Banked</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pendingBankDeposit && pendingBankDeposit.length > 0 ? pendingBankDeposit?.map((item: BankDeposit) => {
                                return (<tr key={item.bagId}>
                                    <td className="m-auto text-center">
                                        <Checkbox
                                            id={`checkbox-${item.bagId}`}
                                            defaultChecked={item.status != "awaiting deposit"}
                                            onCheckedChange={() => onCheckboxChange(item)}
                                            disabled={item.status === "deposited" || item.status === "awaiting banking"}
                                        />
                                    </td>
                                    <td className="px-4 py-3">{item?.bagId}</td>
                                    <td className="px-4 py-3">{item?.dateReceived ? getDate(item?.dateReceived) : "-"}</td>
                                    <td className="px-4 py-3">{getDate(item.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className={`${item?.status === "deposited" ? "text-green-500 border-green-500" : "text-orange-500 border-orange-500"}`}>{item?.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">{formatNumber(item?.value)}</td>
                                </tr>)
                            }) :
                                <tr>
                                    <td className=" text-center p-4" colSpan={6}>No Data To Display</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}