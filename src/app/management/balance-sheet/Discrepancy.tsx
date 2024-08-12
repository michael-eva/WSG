import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNumber, getDate } from "@/utils/utils";
type DiscrepancyData = {
    id: number,
    clientName: string,
    grandTotal: number,
    countDiscrepancyReason?: string,
    guardDiscrepancyReason?: string,
    guardReturnValue?: number,
    countValue?: number,
    guard: string,
    deliveryDate: Date,
}
export default function Discrepancy({ discrepancyData }: { discrepancyData: DiscrepancyData[] }) {

    return (
        <div>
            <h1>Discrepancies</h1>
            <div className="">
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <div className="max-h-80 overflow-y-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-100 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Service Date</th>
                                    <th className="px-4 py-3">Client Name</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Expected Value</th>
                                    <th className="px-4 py-3">Count Value</th>
                                    <th className="px-4 py-3">Guard Returned Value</th>
                                    <th className="px-4 py-3">Guard Reason</th>
                                    <th className="px-4 py-3">Count Reason</th>
                                    <th className="px-4 py-3">Guard Name</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {discrepancyData && discrepancyData.length > 0 ? discrepancyData.map((item, id) => (
                                    <tr key={id}>
                                        <td className="px-4 py-3 text-center">{getDate(item?.deliveryDate)}</td>
                                        <td className="px-4 py-3 text-center">{item?.clientName}</td>
                                        <td className="px-4 py-3 text-center">Change Order / Cash Swap</td>
                                        <td className="px-4 py-3 text-center">{formatNumber(item?.grandTotal)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {item?.countValue ? `${formatNumber(item?.countValue)}` : <Badge className="bg-orange-500">Pending</Badge>}
                                        </td>
                                        <td className="px-4 py-3 text-center">{formatNumber(item?.guardReturnValue)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {item?.guardDiscrepancyReason ? item.guardDiscrepancyReason : <Badge className="bg-teal-500">N/A</Badge>}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {item?.countDiscrepancyReason ? item?.countDiscrepancyReason : <Badge className="bg-orange-500">Pending</Badge>}
                                        </td>
                                        <td className="px-4 py-3 text-center">{item?.guard}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-3 text-center">No data to display</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
