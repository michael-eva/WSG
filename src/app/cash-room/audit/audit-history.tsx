import { formatNumber, getDate } from "@/utils/utils"
import useAuditHistory from "./useAuditHistory"

export default function AuditHistory() {
    const { auditHistory } = useAuditHistory()
    console.log(auditHistory)
    return (
        <div>
            <h1>Audit History</h1>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto flex max-h-[80vh] w-[751px] border">
                <table className="w-full table-auto">
                    <thead className="bg-gray-100 text-gray-600 font-medium">
                        <tr>
                            <th className="px-4 py-3 ">Date</th>
                            <th className="px-4 py-3 ">Value</th>
                            <th className="px-4 py-3 ">Discrepancy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {auditHistory.map((item, id) => (
                            <tr key={id}>
                                <td className="px-4 py-3 text-center">{getDate(item?.created_at)}</td>
                                <td className="px-4 py-3 text-center">{formatNumber(item?.value)}</td>
                                <td className={`px-4 py-3 text-center ${item?.discrepancy !== 0 ? "text-red-500" : ""}`}>
                                    {formatNumber(item?.discrepancy)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}
