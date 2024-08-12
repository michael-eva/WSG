import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatNumber, getDate } from "@/utils/utils";

type CashCount = {
    id: number;
    cashOrderId: number | null;
    changeOrderId: number | null;
    clientName: string;
    coinTotal: number;
    countDate: Date;
    countDiscrepancyReason: string;
    created_at: string;
    fifty: number;
    fiftyC: number;
    five: number;
    fiveC: number;
    grandTotal: number;
    hundred: number;
    cashCountId: number;
    noteTotal: number;
    one: number;
    status: string;
    ten: number;
    tenC: number;
    twenty: number;
    twentyC: number;
    two: number;
};
export default function Table({ clientTransactions, handleCheckboxChange }: { clientTransactions: CashCount[], handleCheckboxChange: any }) {
    const getStatus = (status: string) => {
        switch (status) {
            case 'client payable':
                return 'Payable';
            case 'paid':
                return 'Paid';
            case 'awaiting banking':
                return 'Awaiting banking';
            default:
                return 'Unknown';
        }

    }
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'client payable':
                return 'purple-500';
            case 'paid':
                return 'green-500';
            case 'awaiting banking':
                return 'orange-500';
            default:
                return 'gray-500';
        }

    }
    return (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto flex max-h-[80vh] w-[751px]">
            <table className="w-full table-auto">
                <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                        <th className="px-4 py-3 ">Paid?</th>
                        <th className="px-4 py-3 ">Client</th>
                        <th className="px-4 py-3 ">Date Processed</th>
                        <th className="px-4 py-3 ">Status</th>
                        <th className="px-4 py-3 ">Value</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {clientTransactions.map((client) => (

                        <tr key={client.id}>
                            <td className="m-auto text-center">
                                <Checkbox
                                    id={`checkbox-${client.id}`}
                                    defaultChecked={client.status === "paid"}
                                    onCheckedChange={() => handleCheckboxChange(client)}
                                    disabled={client.status === "awaiting banking"}
                                />
                            </td>
                            <td className="px-4 py-3 text-center">{client.clientName}</td>
                            <td className="px-4 py-3 text-center">{getDate(client.countDate)}</td>
                            <td className="px-4 py-3 text-center">
                                <Badge variant="outline" className={`text-${getStatusColor(client.status)} border-${getStatusColor(client.status)}`}>{getStatus(client.status)}</Badge>
                            </td>
                            <td className="px-4 py-3 text-center">{formatNumber(client.grandTotal)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
