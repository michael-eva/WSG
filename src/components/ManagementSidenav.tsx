"use client"
import Link from "next/link";
import { Package2Icon, HomeIcon, PackageIcon, UsersIcon, LineChartIcon } from "./ui/icons";
import { usePathname } from 'next/navigation'
import { useState } from "react";

export default function SideNav() {
    const pathname = usePathname()
    const [showCashroomDashboard, setShowCashroomDashboard] = useState<boolean>(false)
    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 max-w-[180px]">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="#">
                        <Package2Icon className="h-6 w-6" />
                        <span className="">Management</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/management' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/management/"
                        >
                            <HomeIcon className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/management/clients-payable' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/management/clients-payable?status=client+payable"
                        >
                            <UsersIcon className="h-4 w-4" />
                            Clients Payable
                        </Link>
                        {/* <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/management/balance-sheet' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/management/balance-sheet"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Balance Sheet
                        </Link> */}
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/management/banking' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/management/banking"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Banking
                        </Link>
                        <Link
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            href="/management/settings"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Settings
                        </Link>
                        <div
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer ${showCashroomDashboard === true ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                            onClick={() => setShowCashroomDashboard(!showCashroomDashboard)}
                        >
                            <HomeIcon className="h-4 w-4" />
                            CashRoom Dashboard
                            {showCashroomDashboard === false ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12.0001 12.879L15.7126 9.1665L16.7731 10.227L12.0001 15L7.22705 10.227L8.28755 9.1665L12.0001 12.879Z" fill="black" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12.0001 11.121L8.28755 14.8335L7.22705 13.773L12.0001 9L16.7731 13.773L15.7126 14.8335L12.0001 11.121Z" fill="black" />
                                </svg>
                            }
                        </div>
                    </nav>
                    {showCashroomDashboard && <CashroomEntry pathname={pathname} />}
                </div>
            </div>
        </div>
    );
}
function CashroomEntry({ pathname }: { pathname: string }) {
    return (
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
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                    href="#"
                >
                    <LineChartIcon className="h-4 w-4" />
                    Coin Bin
                </Link>
                <Link
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === '/' ? 'bg-gray-100 text-gray-900 dark:bg-gray-800' : ' text-gray-500 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50'}`}
                    href="/cash-room/banking"
                >
                    <LineChartIcon className="h-4 w-4" />
                    Banking
                </Link>
            </nav>
        </div>
    )
}

