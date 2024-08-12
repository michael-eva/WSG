'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import BankingHistory from "./BankingHistory";
import { supabase } from "@/utils/supabaseClient";
import { getBankingData, getDepositBagData, insertBankingData, updateBankingStatus, } from "./utils";
import AwaitingBanking from "./AwaitingBanking";
import { UrlParamsProvider } from './UrlParamsContext';
import { formatNumber, getDate } from "@/utils/utils";
import { useRouter } from "next/navigation";
type BankingDataOption = {
    value: number;
    label: string;
    clientName: string;
    countDate: string;
    grandTotal: number;
    changeOrderId?: string;
    cashCountId?: string;
};
type FormValues = {
    bankingValue: number;
    bagNumber: string;
    clients: { name: string; id: number, changeOrderId?: string, cashCountId?: string, grandTotal: number }[];
};

type BankingData = {
    id: number,
    grandTotal: number,
    status: string,
    clientName: string,
    countDate: string,
    changeOrderId?: string,
    cashCountId?: string
}

type FormData = {
    bagNumber: string;
    bankingValue: number;
    clients: { name: number; id: string, changeOrderId?: string, cashCountId?: string }[];
};

export default function Banking() {
    const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
        defaultValues: {
            clients: [],
            bankingValue: undefined,
            bagNumber: ''
        }
    });
    const router = useRouter();
    const [totalValue, setTotalValue] = useState(0);
    const [bankingData, setBankingData] = useState<BankingData[]>();
    const [depositBagData, setDepositBagData] = useState<any>();

    useEffect(() => {
        const getData = async () => {
            const res: any = await getBankingData();
            setBankingData(res);
            const depositBagData = await getDepositBagData();
            setDepositBagData(depositBagData);
        }
        getData();
    }, []);

    const onSubmit = async (data: FormData) => {
        console.log("data", data);

        const clientIds = data.clients.map(client => client.id);

        const response = await insertBankingData(data);
        if (response.error) {
            console.log("Failed to insert data:", response.error);
        } else {
            console.log("Data inserted successfully:", response.data)
        }
        updateBankingStatus(clientIds)
            .then(response => {
                if (response.error) {
                    console.log("Failed to update data:", response.error);
                } else {
                    console.log("Status updated successfully:", response.data);
                }
            }).then(() => window.location.reload())
        reset()
    };

    const handleSelectChange = (selectedOptions: BankingDataOption[]) => {
        const clients = selectedOptions.map(option => ({
            id: option.value,
            name: option.clientName,
            changeOrderId: option.changeOrderId,
            cashCountId: option.cashCountId,
            grandTotal: option.grandTotal
        }));

        setValue('clients', clients, { shouldValidate: true });

        const total = clients.reduce((acc, client) => {
            return acc + (isNaN(client.grandTotal) ? 0 : client.grandTotal);
        }, 0);

        setTotalValue(total);
        setValue('bankingValue', total);
    };


    return (
        <div className="">
            <h1>Banking</h1>
            <div className="py-4">
                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Enter deposit bag</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        {/* @ts-ignore */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex justify-between w-full gap-2">
                                <div className="w-1/2">
                                    <Label htmlFor="clientName">Select Client({watch('clients').length})</Label>
                                    <Select<BankingDataOption, true>
                                        isMulti
                                        options={bankingData?.map(order => ({
                                            value: order.id,
                                            label: `${order.clientName} - ${getDate(order.countDate)} - ${formatNumber(order.grandTotal)}`,
                                            clientName: order.clientName,
                                            countDate: order.countDate,
                                            grandTotal: order.grandTotal,
                                            changeOrderId: order.changeOrderId,
                                            cashCountId: order.cashCountId
                                        }))}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        //@ts-ignore
                                        onChange={handleSelectChange}
                                        value={watch('clients').map(client => ({
                                            value: client.id,
                                            label: client.name,
                                            clientName: client.name,
                                            countDate: '',  // You might want to store this in your form data if needed
                                            grandTotal: client.grandTotal,
                                            changeOrderId: client.changeOrderId,
                                            cashCountId: client.cashCountId
                                        }))}
                                        formatOptionLabel={(option: BankingDataOption, { context }) => {
                                            if (context === 'menu') {
                                                return (
                                                    <div>
                                                        <div>{option.clientName} {getDate(option.countDate)}</div>
                                                        <div className="text-sm text-gray-500">{formatNumber(option.grandTotal)}</div>
                                                    </div>
                                                );
                                            }
                                            return option.clientName;
                                        }}
                                    />
                                </div>

                                <div className="w-1/2">
                                    <Label htmlFor="bagNumber">Bag Number</Label>
                                    <Input {...register('bagNumber')} id="bagNumber" placeholder="Bag Number" />
                                </div>
                            </div>
                            <div className="flex items-end pt-4 gap-10 justify-between">
                                <div className="flex flex-col gap-1 w-1/2">
                                    <Label htmlFor="bankingValue">Banking Value</Label>
                                    <Input {...register('bankingValue')} id="countValue" placeholder="Banking value" disabled value={totalValue} />
                                </div>
                                <Button type="submit" className="w-1/3" disabled={watch("clients").length < 1 || watch('bagNumber').length < 1}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <UrlParamsProvider>
                <div className="flex flex-col gap-5">
                    <AwaitingBanking />
                    <BankingHistory />
                </div>
            </UrlParamsProvider>
        </div>
    );
}
