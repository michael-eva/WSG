import { supabase } from "@/utils/supabaseClient";

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

export async function getAllClientsTransactions(clients: string[] = [], status: string = '', dateProcessed: string = '') {
    let query = supabase
      .from('cash-counted')
      .select('*')
      .not('cashCountId', 'is', null);
  
    if (clients.length > 0) {
      query = query.in('clientName', clients);
    }
  
    if (status) {
      query = query.eq('status', status);
    }
  
    if (dateProcessed) {
      query = query.eq('countDate', dateProcessed);
    }
  
    // Add ordering
    query = query.order('status', { ascending: false, nullsFirst: false });
  
    const { data, error } = await query;
  
    if (error) throw error;
  
    // Custom sorting function
    const statusOrder = ['clients payable', 'awaiting banking', 'paid'];
    const sortedData = data?.sort((a, b) => {
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);
      return statusA - statusB;
    });
  
    return sortedData;
  }


export async function changePaymentStatus(payment:CashCount, newStatus: string){
    const {data, error} = await supabase
    .from("cash-counted")
    .update({status: newStatus})
    .eq("id", payment.id)
    .select()
if (error){
    console.error(error);
}
return data
}
