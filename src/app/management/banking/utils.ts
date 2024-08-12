import { supabase } from "@/utils/supabaseClient";
type BankDeposit = {
    value: number,
    bagId: string,
    status?: string,
    created_at: Date,
    dateReceived: Date
}
export async function getBankDeposits(){
    const {data, error} = await supabase
    .from("deposit-bag")
    .select("value, bagId, status, created_at, dateReceived")
    // .eq('status', "awaiting deposit")
    .order('dateReceived', { ascending: false })

    if (error){
        console.error(error);
    }
    return data as BankDeposit[]
}
export async function changeDepositStatus(order: BankDeposit, newStatus: string){
    const {data, error} = await supabase
    .from("deposit-bag")
    .update({status: newStatus, dateReceived: new Date()})
    .eq("bagId", order.bagId)
}
export const updateCashInputCashCountedStatus = async (cashInputIds: number[]) => {
    const { data, error } = await supabase
    .from('cash-counted')
    .update({ status: 'client payable' })
    .in('cashCountId', cashInputIds);
  
    if (error) {
      console.error('Error updating client status:', error);
      return null;
    }
    return data;
  }
  export const getDepositBagData = async () => {
    const { data, error } = await supabase
    .from('deposit-bag')
    .select('bagId, value, status, created_at, clientNames, changeOrderIds, cashCountIds')
    .eq('status', 'awaiting deposit');
  
    if (error) {
      console.error('Error getting deposit bag data:', error);
      return null;
    }
    return data;
  }
  export const updateDepositBagStatus = async (bagId: string) => {
    const { data, error } = await supabase
    .from('deposit-bag')
    .update({ status: 'deposited',  dateReceived:new Date().toISOString()})
    .eq('bagId', bagId);
  
    if (error) {
      console.error('Error updating deposit bag status:', error);
      return null;
    }
    return data;
  }
  export const updateBankingCashCountStatus = async (cashCountId: number[]) => {
    const { data, error } = await supabase
    .from('banking')
    .update({ status: 'deposited' })
    .in('cashCountId', cashCountId);
  
    if (error) {
      console.error('Error updating client status:', error);
      return null;
    }
    return data;
  }

  export const updateBankingChangeOrderStatus = async (changeOrderIds: number[]) => {
    const { data, error } = await supabase
    .from('banking')
    .update({ status: 'deposited' })
    .in('changeOrderId', changeOrderIds);
  
    if (error) {
      console.error('Error updating client status:', error);
      return null;
    }
    return data;
  }
  export const updateChangeOrderCashCountedStatus = async (changeOrderIds: number[]) => {
    const { data, error } = await supabase
    .from('cash-counted')
    .update({ status: 'completed' })
    .in('changeOrderId', changeOrderIds);
  
    if (error) {
      console.error('Error updating client status:', error);
      return null;
    }
    return data;
  }