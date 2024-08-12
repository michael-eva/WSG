import { supabase } from "@/utils/supabaseClient";
type CashOnHand = {
    totalfifty: number;
    totaltwenty: number;
    totalten: number;
    totalfive: number;
    totaltwo: number;
    totalone: number;
    totalfiftyc: number;
    totaltwentyc: number;
    totaltenc: number;
    totalfivec: number;
    totalgrandtotal: number;
    totalcointotal: number;
    totalnotetotal: number;
}
  export const getTotalCashOnHand = async () => {
    const { data, error } = await supabase.rpc('calculate_cash_on_hand_breakdown').single();
  
    if (error) {
      console.error('Error calculating total cash on hand:', error);
      return null;
    }
    return data as CashOnHand;
  }
  export const getInTransitCashData = async () => {
    try {
        const { data, error } = await supabase
            .from('change-order')
            .select('grandTotal, coinTotal, noteTotal, clientName, id')
            .in('status', ['dispatched'])
            .eq('isEFT', false);

        if (error) {
            console.error('Error fetching cash swap data:', error);
            return { totalGrandTotal: 0, dispatchedCash: []  };
        }

        const totalGrandTotal = data.reduce((acc, record) => acc + (record.grandTotal || 0), 0);
        return { totalGrandTotal, dispatchedCash: data };
    } catch (err) {
        console.error('Unexpected error fetching cash swap data:', err);
        return { totalGrandTotal: 0, dispatchedCash: [] };
    }
};
export const getPackedCashData = async () => {
    try {
        const { data, error } = await supabase
            .from('change-order')
            .select('grandTotal, coinTotal, noteTotal, clientName, id')
            .in('status', ['packed'])
            .eq('isEFT', false);

        if (error) {
            console.error('Error fetching cash swap data:', error);
            return { grandTotal: 0, coinTotal: 0, noteTotal: 0, packedCash: []  };
        }

        if (data) {
            const totalGrandTotal = data.reduce((acc, record) => acc + (record.grandTotal || 0), 0);
            const totalCoinTotal = data.reduce((acc, record) => acc + (record.coinTotal || 0), 0);
            const totalNoteTotal = data.reduce((acc, record) => acc + (record.noteTotal || 0), 0);
            return { grandTotal: totalGrandTotal, coinTotal: totalCoinTotal, noteTotal: totalNoteTotal, packedCash: data };
        } else {
            console.error('No data returned from Supabase.');
            return { grandTotal: 0, coinTotal: 0, noteTotal: 0, packedCash: []  };
        }
    } catch (err) {
        console.error('Unexpected error fetching cash swap data:', err);
        return { grandTotal: 0, coinTotal: 0, noteTotal: 0, packedCash: []  };
    }
};

export const getBankingData = async () => {
    try {
        const { data, error } = await supabase
            .from('banking')
            .select('grandTotal, clientName, id')
            .eq('status', 'awaiting banking');
        
        if (error) {
            console.error('Error fetching banking data:', error);
            return { outstandingBankingValue: 0, outstandingBanking: []  };
        }
        
        const outstandingBankingValue = data.reduce((acc, record) => acc + record.grandTotal, 0);
        return { outstandingBankingValue, outstandingBanking: data };
    } catch (err) {
        console.error('Unexpected error fetching banking data:', err);
        return { outstandingBankingValue: 0, outstandingBanking: []  };
    }
};
export const getDepositBagData = async () => {
    try {
        const { data, error } = await supabase
            .from('deposit-bag')
            .select('value, bagId')
            .eq('status', 'awaiting deposit');
        
        if (error) {
            console.error('Error fetching deposit bag data:', error);
            return { outstandingDepositBagValue: 0, outstandingDepositBags: []  };
        }
        
        const outstandingDepositBagValue = data.reduce((acc, record) => acc + record.value, 0);
        return { outstandingDepositBagValue, outstandingDepositBags: data };
    } catch (err) {
        console.error('Unexpected error fetching deposit bag data:', err);
        return { outstandingDepositBagValue: 0, outstandingDepositBags: []  };
    }
};
export const getClientsPayable = async () => {
    const { data, error } = await supabase
        .from('cash-counted')
        .select('grandTotal, clientName')
        .or('status.eq.client payable,status.eq.awaiting banking')
        .is('changeOrderId', null);

    if (error) {
        console.error('Error fetching clients payable data:', error);
        return { totalClientsPayable: 0, clientsPayable: [] };
    }

    if (!data) {
        console.error('No data returned from Supabase.');
        return { totalClientsPayable: 0, clientsPayable: [] };
    }

    const totalClientsPayable = data.reduce((acc, record) => acc + (record.grandTotal || 0), 0);
    return { totalClientsPayable, clientsPayable: data };
};
export const getUnverifiedClientReimbursements = async () => {
    try {
        const { data, error } = await supabase
            .from('change-order')
            .select('grandTotal, clientName, id')
            .eq('status', 'pending count')
            .eq('isEFT', false);
        
        if (error) {
            console.error('Error fetching unverified client reimbursements:', error);
            return { totalUnverifiedClientReimbursements: 0, pendingCashSwap:[]};
        }
        
        const totalUnverifiedClientReimbursements = data.reduce((acc, record) => acc + record.grandTotal, 0);
        return { totalUnverifiedClientReimbursements, pendingCashSwap: data };
    } catch (err) {
        console.error('Unexpected error fetching unverified client reimbursements:', err);
        return { totalUnverifiedClientReimbursements: 0, pendingCashSwap: [] };
    }
};

export const getClientReimbursementDue = async()=>{
    const { data, error } = await supabase
        .from('change-order')
        .select('grandTotal')
        .eq('status', 'deposited')
        .eq('isEFT', false);
        if (error) {
            console.error('Error fetching client reimbursement due:', error);
            return null;
        }
        const totalClientReimbursementDue = data.reduce((acc, record) => acc + record.grandTotal, 0);
        return totalClientReimbursementDue;
}

export const setEFTChangeOrderData = async({ EFTChangeOrder }:{EFTChangeOrder: {clientName: string | null | undefined, isEFT: boolean, eftValue: number | null}}) => {
    const { data, error } = await supabase
        .from('change-order')
        .insert([
            {
                clientName: EFTChangeOrder.clientName,
                isEFT: EFTChangeOrder.isEFT,
                eftValue: EFTChangeOrder.eftValue,
                status: "pending_eft_processing"
            }
        ]);

    if (error) {
        console.error('Error setting EFT change order data:', error);
        return null;
    }
    return data;
};
export const getEFTs = async()=>{
    const { data, error } = await supabase
        .from('change-order')
        .select('eftValue, clientName, status, isEFT')
        .eq('isEFT', true)

    if (error) {
        console.error('Error fetching EFT data:', error);
        return { totalEFT: 0, EFTs: [] };
    }

    if (!data) {
        console.error('No data returned from Supabase.');
        return { totalEFT: 0, EFTs: [] };
    }

    const totalEFT = data.reduce((acc, record) => acc + (record.eftValue || 0), 0);
    return { totalEFT, EFTs: data };
}

export const getUnknownData = async()=>{
    const { data, error } = await supabase
    .from("unknown-bank-deposits")
    .select('*')

    if (error) {
        console.error('Error fetching unknown data:', error);
        return { totalUnknown: 0, unknowns: [] };
    }

    if (!data) {
        console.error('No data returned from Supabase.');
        return { totalUnknown: 0, unknowns: [] };
    }

    const totalUnknown = data.reduce((acc, record) => acc + (record.value || 0), 0);
    return { totalUnknown, unknowns: data };

}

export const setUnknownBankDeposit = async({ name, value }:{value: number | null, name: string | null | undefined}) => {
    const { data, error } = await supabase
        .from('unknown-bank-deposits')
        .insert([
            {
                value: value,
                name: name,
            }
        ]);

    if (error) {
        console.error('Error setting unknown bank deposit data:', error);
        return null;
    }
    return data;
}
export async function deleteUnknownBankDeposit(name:string){
    const { data, error } = await supabase
        .from('unknown-bank-deposits')
        .delete()
        .match({name: name})
    if (error) {
        console.error('Error deleting unknown bank deposit:', error);
        return null;
    }
    return data;
}

export async function setBalanceSheetData({balanceSheetData}: any){
const {data, error} = await supabase
.from('balance-sheet')
.insert([
    balanceSheetData
]);
if (error) {
    console.error('Error setting balance sheet data:', error);
    return null;
}
return data;
}

export async function getBalanceSheetHistory() {
    const { data, error } = await supabase
        .from("balance-sheet")
        .select("*")
        .order('created_at', { ascending: false }); // Sorting by created_at in descending order

    if (error) {
        console.error("Error fetching data:", error);
    }
    return data;
}

export const getMiscData = async()=>{
    const { data, error } = await supabase
    .from("misc-assets")
    .select('*')

    if (error) {
        console.error('Error fetching unknown data:', error);
        return { totalMisc: 0, misc: [] };
    }

    if (!data) {
        console.error('No data returned from Supabase.');
        return { totalMisc: 0, misc: [] };
    }

    const totalMisc = data.reduce((acc, record) => acc + (record.value || 0), 0);
    return { totalMisc, misc: data };

}
export async function deleteMiscData(name:string){
    const { data, error } = await supabase
        .from('misc-assets')
        .delete()
        .match({name: name})
    if (error) {
        console.error('Error deleting unknown bank deposit:', error);
        return null;
    }
    return data;
}
export const setMiscData = async({ name, value }:{value: number | null, name: string | null | undefined}) => {
    const { data, error } = await supabase
        .from('misc-assets')
        .insert([
            {
                value: value,
                name: name,
            }
        ]);

    if (error) {
        console.error('Error setting unknown bank deposit data:', error);
        return null;
    }
    return data;
}
export const getOutstandingOrders = async () => {
    const { data, error } = await supabase
    .from("cash-order")
    .select("name, grandTotal")
    .neq('status', 'processed')

    if (error) {
        console.error('Error fetching outstanding orders:', error);
        return null;
    }
    const totalOutstandingOrders = data.reduce((acc, record) => acc + (record.grandTotal || 0), 0);
    return {totalOutstandingOrders, outstandingOrders: data};
}
