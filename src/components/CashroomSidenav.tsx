"use client"
import Link from "next/link";
import { Package2Icon, HomeIcon, PackageIcon, UsersIcon, LineChartIcon } from "./ui/icons";
import { usePathname } from 'next/navigation'

export default function SideNav() {
    const pathname = usePathname()
    return (
        <div className="border-r bg-gray-100/40  dark:bg-gray-800/40 h-screen">
            <div className="flex h-full flex-col gap-2 overflow-auto">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="#">
                        <Package2Icon className="h-6 w-6" />
                        <span className="">West-Sure</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            // className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/cash-room' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/cash-room"
                        >
                            <HomeIcon className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/cash-room/change-order' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/cash-room/change-order"
                        >
                            <PackageIcon className="h-4 w-4" />
                            Change Order
                        </Link>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/cash-room/cash-processing' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/cash-room/cash-processing"
                        >
                            <UsersIcon className="h-4 w-4" />
                            Cash Processing
                        </Link>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/cash-room/audit' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/cash-room/audit"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Audit
                        </Link>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50`}
                            onClick={() => window.location.href = `/cash-room/banking?awaitingBanking-status=awaiting+banking&bankingHistory-status=awaiting+deposit`}
                            href="#"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Banking
                        </Link>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/guard-portal"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Guard Portal
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
// function CalendarDaysIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"`
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
//             <line x1="16" x2="16" y1="2" y2="6" />
//             <line x1="8" x2="8" y1="2" y2="6" />
//             <line x1="3" x2="21" y1="10" y2="10" />
//             <path d="M8 14h.01" />
//             <path d="M12 14h.01" />
//             <path d="M16 14h.01" />
//             <path d="M8 18h.01" />
//             <path d="M12 18h.01" />
//             <path d="M16 18h.01" />
//         </svg>
//     )
// }


// function ChevronDownIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m6 9 6 6 6-6" />
//         </svg>
//     )
// }


// function HomeIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//             <polyline points="9 22 9 12 15 12 15 22" />
//         </svg>
//     )
// }


// function LineChartIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M3 3v18h18" />
//             <path d="m19 9-5 5-4-4-3 3" />
//         </svg>
//     )
// }


// function Package2Icon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
//             <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
//             <path d="M12 3v6" />
//         </svg>
//     )
// }


// function PackageIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m7.5 4.27 9 5.15" />
//             <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
//             <path d="m3.3 7 8.7 5 8.7-5" />
//             <path d="M12 22V12" />
//         </svg>
//     )
// }


// function UsersIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//             <circle cx="9" cy="7" r="4" />
//             <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//             <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//         </svg>
//     )
// }

