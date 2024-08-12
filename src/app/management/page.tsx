'use client'
import { useEffect, useState } from "react"
import { getClientsPayable } from "./utils"
import { getOutstandingBankDeposits } from "./utils"
import BalanceSheet from "./balance-sheet/page"
type ClientsPayable = {
    clientName: string,
    countDate: string,
    grandTotal: number,
    status: string
}
type OutstandingBankDeposits = {
    bagId: string,
    value: number,
    status: string,
    created_at: string
}

export default function ManagementDashboard() {
    const [clientsPayable, setClientsPayable] = useState<ClientsPayable[]>([])
    const [outstandingBankDeposits, setOutstandingBankDeposits] = useState<OutstandingBankDeposits[]>([])

    useEffect(() => {
        getClientsPayable().then((data) => {
            setClientsPayable(data)
        })
        getOutstandingBankDeposits().then((data) => {
            setOutstandingBankDeposits(data)
        })
    }, [])



    return (
        <BalanceSheet />
        // <div className="flex flex-wrap gap-5 ">
        //     <div className="">
        //         <h1 >Clients Payable</h1>
        //         <div className="bg-white rounded-lg shadow-md overflow-x-auto ">
        //             <table className="w-full table-auto">
        //                 <thead className="bg-gray-100 text-gray-600 font-medium">
        //                     <tr>
        //                         <th className="px-4 py-3 text-left">Client</th>
        //                         <th className="px-4 py-3 text-left">Date Processed</th>
        //                         <th className="px-4 py-3 text-left">Status</th>
        //                         <th className="px-4 py-3 text-right">Value</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody className="divide-y divide-gray-200">
        //                     {clientsPayable && clientsPayable.length > 0 ? clientsPayable.map((client) => (

        //                         <tr>
        //                             <td className="px-4 py-3">{client.clientName}</td>
        //                             <td className="px-4 py-3">{client.countDate}</td>
        //                             <td className="px-4 py-3">
        //                                 <Badge variant="outline" className={`${client.status === 'client payable' ? "text-orange-500 border-orange-500" : "text-purple-500 border-purple-500"}`}>{client.status}</Badge>
        //                             </td>
        //                             <td className="px-4 py-3 text-right">${client.grandTotal}</td>
        //                         </tr>
        //                     ))
        //                         :
        //                         <tr>
        //                             <td colSpan={4} className="px-4 py-3 text-center">No data to display</td>
        //                         </tr>
        //                     }
        //                 </tbody>
        //             </table>
        //         </div>
        //     </div>
        //     <div className="">
        //         <h1>Outstanding Bank Deposits</h1>
        //         <div className="bg-white rounded-lg shadow-md overflow-x-auto ">
        //             <table className="w-full table-auto">
        //                 <thead className="bg-gray-100 text-gray-600 font-medium">
        //                     <tr>
        //                         <th className="px-4 py-3 text-left">Bag ID</th>
        //                         <th className="px-4 py-3 text-left">Date Banked</th>
        //                         <th className="px-4 py-3 text-left">Status</th>
        //                         <th className="px-4 py-3 text-right">Value</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody className="divide-y divide-gray-200">
        //                     {outstandingBankDeposits && outstandingBankDeposits.length > 0 ? outstandingBankDeposits.map(item => (
        //                         <tr>
        //                             <td className="px-4 py-3">{item?.bagId}</td>
        //                             <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('en-AU')}</td>
        //                             <td className="px-4 py-3">
        //                                 <Badge variant="outline" className="text-green-500 border-green-500">{item?.status}</Badge>
        //                             </td>
        //                             <td className="px-4 py-3 text-right">${item?.value}</td>
        //                         </tr>
        //                     ))
        //                         :
        //                         <tr>
        //                             <td colSpan={4} className="px-4 py-3 text-center">No data to display</td>
        //                         </tr>
        //                     }
        //                 </tbody>
        //             </table>
        //         </div>
        //     </div>

        // </div>
    )
}
