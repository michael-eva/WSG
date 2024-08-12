import { useState, useEffect } from 'react';
import { deleteCashOnHandData, insertCashOnHandData, updateChangeOrderData, updateChangeOrderStatus } from './utils';
import { ChangeOrderData } from '@/app/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatNumber, getDate } from '@/utils/utils';
import { toast } from 'react-hot-toast';
import { CiEdit } from "react-icons/ci";
import { RxCheck } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

export default function OrderHistory({ changeOrderData, fetchData }: { changeOrderData: ChangeOrderData[] | undefined, fetchData: any }) {
    const [selectedOrders, setSelectedOrders] = useState<ChangeOrderData[]>([]);
    const [editableRows, setEditableRows] = useState<{ [key: number]: boolean }>({});
    const [editedData, setEditedData] = useState<{ [key: number]: Partial<ChangeOrderData> }>({});

    const orderStatusColours = (status: string) => {
        if (status === "pending count") {
            return "bg-gray-400 hover:bg-gray-400"
        } else if (status === "unprocessed" || status === "eft_unprocessed") {
            return "bg-purple-200 hover:bg-purple-200 text-gray-500 border-2 border-purple-500"
        } else if (status === "packed") {
            return "bg-orange-200 hover:bg-orange-200 border border-orange-500 border-2 text-gray-500"
        } else if (status === "eft_packed") {
            return "bg-yellow-200 hover:bg-yellow-200 border border-yellow-500 border-2 text-gray-500"
        } else if (status === "processed" || status === "eft_processed") {
            return "bg-green-200 hover:bg-green-200 text-gray-500 border-2 border-green-500"
        } else if (status === "dispatched") {
            return "bg-yellow-200 hover:bg-yellow-200 border border-yellow-500 border-2 text-gray-500"
        } else if (status === "pending_eft_processing") {
            return "bg-orange-200 hover:bg-orange-200 text-gray-500 border-2 border-orange-500"
        }
    }
    const getStatus = (status: string) => {
        if (status === "unprocessed") {
            return "Unprocessed"
        } else if (status === "packed") {
            return "Packed"
        } else if (status === "eft_packed") {
            return "EFT Packed"
        } else if (status === "dispatched") {
            return "Dispatched"
        } else if (status === "pending count") {
            return "Pending Count"
        } else if (status === "processed") {
            return "Processed"
        } else if (status === "pending_eft_processing") {
            return "Pending"
        }
    }
    const handleUpdateClick = async () => {

        try {
            for (const order of selectedOrders) {
                let newStatus;
                if (order.status === 'unprocessed') {
                    newStatus = 'packed';
                } else if (order.status === 'packed') {
                    newStatus = 'unprocessed';
                }
                else {
                    continue;
                }

                console.log(`Changing status of order ID ${order.id} from ${order.status} to ${newStatus}`);
                const result = await updateChangeOrderStatus(newStatus, order.id);
                console.log("Update Result:", result);

                if (!result) {
                    console.error('Failed to update the status in the database for order ID:', order.id);
                    continue;
                }

                if (newStatus === 'packed') {
                    const preparedCashOnHandData = prepareDataForCashOnHand(order);
                    const cashOnHandResult = await insertCashOnHandData(preparedCashOnHandData);
                    if (!cashOnHandResult) {
                        console.error('Failed to insert data into the cash-on-hand table for order ID:', order.id);
                    } else {
                        console.log('Successfully inserted cash-on-hand data for order ID:', order.id);
                    }
                } else if (newStatus === 'unprocessed') {
                    const deleteResult = await deleteCashOnHandData(order.id);
                    if (!deleteResult) {
                        console.error('Failed to delete data from the cash-on-hand table for order ID:', order.id);
                    } else {
                        console.log('Successfully deleted cash-on-hand data for order ID:', order.id);
                    }
                }
            }
            window.location.reload()
            setSelectedOrders([])
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    const handleCheckboxChange = (order: ChangeOrderData) => {
        setSelectedOrders(prevSelected => {
            if (prevSelected.find(item => item.id === order.id)) {
                return prevSelected.filter(item => item.id !== order.id);
            } else {
                return [...prevSelected, order];
            }
        });
    };

    const toggleEditMode = (orderId: number) => {
        setEditableRows(prev => ({ ...prev, [orderId]: !prev[orderId] }));
        if (!editedData[orderId]) {
            setEditedData(prev => ({ ...prev, [orderId]: { ...changeOrderData?.find(order => order.id === orderId)! } }));
        }
    };

    const handleEdit = (orderId: number, field: string, value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value);
        setEditedData(prev => {
            const updatedOrder = { ...prev[orderId], [field]: numValue };
            const total = calculateTotal(updatedOrder);
            return { ...prev, [orderId]: { ...updatedOrder, grandTotal: total } };
        });
    };

    const calculateTotal = (order: any) => {
        const fields = ['fifty', 'twenty', 'ten', 'five', 'two', 'one', 'fiftyC', 'twentyC', 'tenC', 'fiveC'];
        return fields.reduce((acc, field) => acc + (order[field] || 0), 0);
    };

    const handleSave = async (orderId: number) => {
        await updateChangeOrderData(orderId, editedData[orderId]).then(() => fetchData());
        toggleEditMode(orderId);
    };

    const handleCancel = (orderId: number) => {
        setEditedData(prev => {
            const { [orderId]: _, ...rest } = prev;
            return rest;
        });
        toggleEditMode(orderId);
    };
    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto max-h-[60vh]">
                <table className="w-full table-auto ">
                    <thead className="bg-gray-100 text-gray-600 font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left">Packed?</th>
                            <th className="px-4 py-3 text-left">Client</th>
                            <th className="px-4 py-3 text-left">Date Ordered</th>
                            <th className="px-4 py-3 text-left">Date Delivered</th>
                            <th className="px-4 py-3 text-left">Run</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-right">$50</th>
                            <th className="px-4 py-3 text-right">$20</th>
                            <th className="px-4 py-3 text-right">$10</th>
                            <th className="px-4 py-3 text-right">$5</th>
                            <th className="px-4 py-3 text-right">$2</th>
                            <th className="px-4 py-3 text-right">$1</th>
                            <th className="px-4 py-3 text-right">50c</th>
                            <th className="px-4 py-3 text-right">20c</th>
                            <th className="px-4 py-3 text-right">10c</th>
                            <th className="px-4 py-3 text-right">5c</th>
                            <th className="px-4 py-3 text-right border-2">Total</th>
                        </tr>
                    </thead>
                    {changeOrderData && changeOrderData?.length > 0 ? <tbody className="divide-y divide-gray-200 ">

                        {changeOrderData?.map((order: any, index: number) => {
                            const isEditing = editableRows[order.id];
                            const editedOrder = (isEditing ? editedData[order.id] : order)
                            return (
                                <tr key={index} className={`${(order.status != "unprocessed" && order.status != "eft_unprocessed") && order.status != "packed" ? " text-gray-400" : ""}`}>
                                    <td className="m-auto text-center">
                                        <Checkbox
                                            id={`checkbox-${order.id}`}
                                            defaultChecked={(order.status != "unprocessed" && order.status != "eft_unprocessed")}
                                            onCheckedChange={() => handleCheckboxChange(order)}
                                            disabled={(order.status != "unprocessed" && order.status != "eft_unprocessed") && order.status != "packed" || (selectedOrders.length > 0 && selectedOrders[0]?.status != order.status)}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className='flex items-center gap-2'>
                                            {(order.status === "unprocessed" || order.status === "eft_unprocessed") && !isEditing &&
                                                <button onClick={() => toggleEditMode(order.id)} className='border rounded p-1 hover:bg-gray-200 hover:text-gray-900'>
                                                    <CiEdit />
                                                </button>
                                            }
                                            {(order.status === "unprocessed" || order.status === "eft_unprocessed") && isEditing &&
                                                <>
                                                    <button onClick={() => handleSave(order.id)} className='border rounded p-1 hover:bg-green-200 text-green-600'>
                                                        <RxCheck />

                                                    </button>
                                                    <button onClick={() => handleCancel(order.id)} className='border rounded p-1 hover:bg-red-200 text-red-600'>
                                                        <RxCross2 />
                                                    </button>
                                                </>
                                            }
                                            <p className='flex-grow'>{order.clientName}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{order.orderDate}</td>
                                    <td className="px-4 py-3">{order.deliveryDate}</td>
                                    <td className="px-4 py-3">{order.run}</td>
                                    <td className="px-4 py-3">
                                        <div className='flex gap-2'>
                                            {order?.isEFT && <Badge className="border-teal-500 bg-teal-100 text-gray-500 border-2">EFT</Badge>}
                                            <Badge className={`${orderStatusColours(order.status)}`}>{getStatus(order.status)}</Badge>
                                        </div>
                                    </td>
                                    {['fifty', 'twenty', 'ten', 'five', 'two', 'one', 'fiftyC', 'twentyC', 'tenC', 'fiveC'].map(field => (
                                        <td key={field} className="px-4 py-3 text-right">
                                            {isEditing ?
                                                <input
                                                    type="number"
                                                    value={editedOrder[field] || 0}
                                                    onChange={(e) => handleEdit(order.id, field, e.target.value)}
                                                    className="w-full text-right border rounded p-1 focus:border-gray-500 no-spinner"
                                                /> :
                                                formatNumber(order[field] || 0)
                                            }
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right border-2">{formatNumber(editedOrder.grandTotal)}</td>

                                </tr>
                            )
                        })}

                    </tbody>
                        : <tbody>
                            <tr>
                                <td colSpan={16} className="text-center py-3">No orders found</td>
                            </tr>
                        </tbody>
                    }
                </table>
            </div>
            <div className='flex justify-end mt-5'>
                <Button className=' w-48' onClick={handleUpdateClick} disabled={selectedOrders.length <= 0}>Update</Button>
            </div>
        </>
    )
}

const prepareDataForCashOnHand = (data: ChangeOrderData) => {
    return {
        id: data.id,
        clientName: data.clientName,
        date: new Date().toLocaleDateString('en-AU'), // Set to today
        fifty: data.fifty || 0,
        twenty: data.twenty || 0,
        ten: data.ten || 0,
        five: data.five || 0,
        two: data.two || 0,
        one: data.one || 0,
        fiftyC: data.fiftyC || 0,
        twentyC: data.twentyC || 0,
        tenC: data.tenC || 0,
        fiveC: data.fiveC || 0,
        coinTotal: data.coinTotal,
        noteTotal: data.noteTotal,
        grandTotal: data.grandTotal,
        status: 'debit' // Set status to debit
    };
};
