// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
// import { CalendarDaysIcon, ChevronDownIcon } from "@/components/ui/icons"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// export default function PendingPayments() {
//     return (
//         <div>
//             <div className=" space-y-5">
//                 <div className="grid grid-cols-4 gap-2">
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button className="w-full" variant="outline">
//                                 Client Name
//                                 <ChevronDownIcon className="ml-2 h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="start" className="w-full">
//                             <DropdownMenuItem>John Doe</DropdownMenuItem>
//                             <DropdownMenuItem>Jane Smith</DropdownMenuItem>
//                             <DropdownMenuItem>Bob Johnson</DropdownMenuItem>
//                             <DropdownMenuItem>Sarah Lee</DropdownMenuItem>
//                             <DropdownMenuItem>Tom Wilson</DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button className="w-full" variant="outline">
//                                 Date Received
//                                 <CalendarDaysIcon className="ml-2 h-4 w-4" />
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent align="start" className="w-auto p-0">
//                             <Calendar initialFocus mode="single" />
//                         </PopoverContent>
//                     </Popover>
//                     <Popover>
//                         <PopoverTrigger asChild>
//                             <Button className="w-full" variant="outline">
//                                 Date Banked
//                                 <CalendarDaysIcon className="ml-2 h-4 w-4" />
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent align="start" className="w-auto p-0">
//                             <Calendar initialFocus mode="single" />
//                         </PopoverContent>
//                     </Popover>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button className="w-full" variant="outline">
//                                 Status
//                                 <ChevronDownIcon className="ml-2 h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="start" className="w-full">
//                             <DropdownMenuItem>Run 1</DropdownMenuItem>
//                             <DropdownMenuItem>Run 2</DropdownMenuItem>
//                             <DropdownMenuItem>Run 3</DropdownMenuItem>
//                             <DropdownMenuItem>Run 4</DropdownMenuItem>
//                             <DropdownMenuItem>Run 5</DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//                 <div className="bg-white rounded-lg shadow-md overflow-x-auto ">
//                     <table className="w-full table-auto">
//                         <thead className="bg-gray-100 text-gray-600 font-medium">
//                             <tr>
//                                 <th className="px-4 py-3 text-left">Client</th>
//                                 <th className="px-4 py-3 text-left">Date Receieved</th>
//                                 <th className="px-4 py-3 text-left">Date Banked</th>
//                                 <th className="px-4 py-3 text-left">Status</th>
//                                 <th className="px-4 py-3 text-right">Value</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             <tr>
//                                 <td className="px-4 py-3">Client A</td>
//                                 <td className="px-4 py-3">2023-04-01</td>
//                                 <td className="px-4 py-3">2023-04-05</td>
//                                 <td className="px-4 py-3">
//                                     <Badge variant="outline" className="text-green-500 border-green-500">Delivered</Badge>
//                                 </td>
//                                 <td className="px-4 py-3 text-right">100</td>
//                             </tr>
//                             <tr>
//                                 <td className="px-4 py-3">Client B</td>
//                                 <td className="px-4 py-3">2023-04-02</td>
//                                 <td className="px-4 py-3">2023-04-06</td>
//                                 <td className="px-4 py-3">
//                                     <Badge variant="outline" className="text-green-500 border-green-500">Delivered</Badge>
//                                 </td>
//                                 <td className="px-4 py-3 text-right">75</td>
//                             </tr>
//                             <tr>
//                                 <td className="px-4 py-3">Client C</td>
//                                 <td className="px-4 py-3">2023-04-03</td>
//                                 <td className="px-4 py-3">2023-04-07</td>
//                                 <td className="px-4 py-3">
//                                     <Badge variant="outline" className="text-green-500 border-green-500">Delivered</Badge>
//                                 </td>
//                                 <td className="px-4 py-3 text-right">50</td>
//                             </tr>
//                             <tr>
//                                 <td className="px-4 py-3">Client D</td>
//                                 <td className="px-4 py-3">2023-04-04</td>
//                                 <td className="px-4 py-3">2023-04-08</td>
//                                 <td className="px-4 py-3">
//                                     <Badge variant="outline" className="text-green-500 border-green-500">Delivered</Badge>
//                                 </td>
//                                 <td className="px-4 py-3 text-right">25</td>
//                             </tr>
//                             <tr>
//                                 <td className="px-4 py-3">Client E</td>
//                                 <td className="px-4 py-3">2023-04-05</td>
//                                 <td className="px-4 py-3">2023-04-09</td>
//                                 <td className="px-4 py-3">
//                                     <Badge variant="outline" className="text-green-500 border-green-500">Delivered</Badge>
//                                 </td>
//                                 <td className="px-4 py-3 text-right">10</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }