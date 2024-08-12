
'use client'
import { Button } from "@/components/ui/button";
import BankingHistory from "./BankDeposits";
import { FormEvent, useEffect, useState } from "react";
import { changeDepositStatus, getBankDeposits, getDepositBagData, updateBankingCashCountStatus, updateBankingChangeOrderStatus, updateCashInputCashCountedStatus, updateChangeOrderCashCountedStatus, updateDepositBagStatus } from "./utils";
type BagType = {
    value: number,
    bagId: string,
    status: string,
    created_at: Date,
    dateReceived: Date
}
type BankDeposit = {
    value: number,
    bagId: string,
    status?: string,
    created_at: Date,
    dateReceived: Date
}
type DepositBagData = {
    id?: number;
    value: number;
    bagId: string;
    status: string;
    created_at: Date;
    clientNames: string[]
    changeOrderIds: number[]
    cashCountIds: number[]
}
export default function Page() {
    const [selectedOrders, setSelectedOrders] = useState<BagType[]>([])
    const [pendingBankDeposit, setPendingBankDeposit] = useState<BankDeposit[]>()
    const [depositBagData, setDepositBagData] = useState<DepositBagData[]>([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const pendingBankDeposit = await getBankDeposits()
            if (pendingBankDeposit) {
                setPendingBankDeposit(pendingBankDeposit)
            }

            const depositBagData = await getDepositBagData();
            setDepositBagData(depositBagData as DepositBagData[]);
        }
        getData()
    }, [])
    const handleCheckboxChange = (bag: BagType) => {
        setSelectedOrders(prevSelected => {
            if (prevSelected.find(item => item.bagId === bag.bagId)) {
                return prevSelected.filter(item => item.bagId !== bag.bagId);
            } else {
                return [...prevSelected, bag];
            }
        });
    };

    const handleSubmit = async () => {
        for (const order of selectedOrders) {
            const newStatus = order.status === 'awaiting deposit' ? 'deposited' : 'awaiting deposit';
            await changeDepositStatus(order, newStatus)
        }
    };
    const newhandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Selected IDs:", selectedItems);

        for (const id of selectedItems) {
            const item = depositBagData?.find(item => item.bagId === id);
            console.log("item:", item);

            if (item) {
                const changeOrderIds = item.changeOrderIds;
                const cashCountIds = item.cashCountIds;

                await updateDepositBagStatus(id);
                await updateBankingCashCountStatus(cashCountIds);
                await updateBankingChangeOrderStatus(changeOrderIds);
                await updateChangeOrderCashCountedStatus(changeOrderIds);
                await updateCashInputCashCountedStatus(cashCountIds);
            }
        }
        setSelectedItems([]);
        await getBankDeposits().then((data) => setPendingBankDeposit(data))
    }

    return (
        <div className="">
            <h1>Bank Deposits:</h1>
            <BankingHistory
                handleCheckboxChange={handleCheckboxChange}
                pendingBankDeposit={pendingBankDeposit}
                setSelectedItems={setSelectedItems}
            />
            <form onSubmit={(e) => newhandleSubmit(e)} className="justify-end flex mt-4">
                {pendingBankDeposit && pendingBankDeposit?.length > 0 && (
                    <Button disabled={selectedItems.length === 0}>
                        Submit
                    </Button>
                )}
            </form>
        </div>
    )
}
