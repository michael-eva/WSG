'use server'
import { supabase } from "@/utils/supabaseClient";

export const updateChangeOrderStatus = async (guardName: string | null, ids: number[]) => {
    const { data, error } = await supabase
        .from('change-order')
        .update({ status: 'dispatched', guard: guardName })
        .in('id', ids)
    if (error) {
        console.error('Error fetching data:', error);
    }
    else {
        return data
    }
}