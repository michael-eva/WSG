import { supabase } from "@/utils/supabaseClient"; // Adjust the import based on your project structure

export async function updateChangeOrderStatus(status: string, id: number) {
  const { data, error } = await supabase
      .from('change-order')
      .update({ status })
      .match({ id })
      .select()

  if (error) {
      console.error('Error updating status:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return null;
  }

  return data;
}

export const insertCashOnHandData = async (preparedCashOnHandData: any) => {
  const { data, error } = await supabase
      .from('cash-on-hand')
      .insert([preparedCashOnHandData])
      .select()

  if (error) {
      console.error('Error inserting data into cash-on-hand table:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return null;
  }

  return data;
};

export const deleteCashOnHandData = async (orderId: number) => {
  const { data, error } = await supabase
      .from('cash-on-hand')
      .delete()
      .eq('id', orderId)
      .select()

  if (error) {
      console.error('Error deleting data from cash-on-hand table:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return null;
  }

  return data;
};

  export const getClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select("*")
  
    if (error) {
      console.error('Error fetching clients:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return null;
    }
  
    return data;
  };
  export const getRuns = async () => {
    const { data, error } = await supabase
      .from('runs')
      .select("*")
  
    if (error) {
      console.error('Error fetching runs:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return null;
    }
  
    return data;
  };

  export const getEFTData = async () => {
    const { data, error } = await supabase
    .from('change-order')
    .select("*")
    .eq("status", "pending_eft_processing")

    if (error) {
      console.error('Error fetching EFT data:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return null;
    }

    return data;
  }

  export const updateChangeOrderData = async (orderId: number, data: any) => {
    const { data: updatedData, error } = await supabase
      .from('change-order')
      .update(data)
      .match({ id: orderId })
      .select()

    if (error) {
      console.error('Error updating data:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return null;
    }

    return updatedData;
  };