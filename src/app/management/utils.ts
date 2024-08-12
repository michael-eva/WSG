import { supabase } from "@/utils/supabaseClient";

export async function getClientsPayable(){
    const {error, data} = await supabase
    .from('cash-counted')
    .select('clientName, countDate, grandTotal, status')
    .or('status.eq.client payable,status.eq.awaiting banking');

    if(error) throw error
    return data
}

export async function getOutstandingBankDeposits(){
    const {error, data} = await supabase
    .from('deposit-bag')
    .select('bagId, value, status, created_at')
    .eq("status", "awaiting deposit")

    if(error) throw error
    return data
}

export async function getClients(){
    const {error, data} = await supabase
    .from('clients')
    .select('name')

    if(error) throw error
    return data
}
export async function getAllClientsTransactions(){
    const {error, data} = await supabase
    .from('cash-counted')
    .select('*')
    .not('cashCountId', 'is', null);

    if(error) throw error
    return data
}