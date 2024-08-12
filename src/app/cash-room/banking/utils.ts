import { supabase } from "@/utils/supabaseClient";

export const getBankingData = async () => {
  const { data, error } = await supabase
    .from("banking")
    .select("*")
    .eq("status", "awaiting banking");
  if (error) {
    console.error("Error getting banking data", error);
  }
  return data;
};
type FormData = {
  bagNumber: string;
  bankingValue: number;
  clients: {
    name: number;
    id: string;
    changeOrderId?: string;
    cashCountId?: string;
  }[];
};
export const insertBankingData = async (data: FormData) => {
  console.log(data);

  const clientNames = data.clients.map((client) => client.name);
  const changeOrderIds = data.clients
    .map((client) => client.changeOrderId)
    .filter((id) => id !== null && id !== undefined);

  const cashCountIds = data.clients
    .map((client) => client.cashCountId)
    .filter((id) => id !== null && id !== undefined);
  const { error, data: responseData } = await supabase
    .from("deposit-bag")
    .insert([
      {
        bagId: data.bagNumber,
        value: data.bankingValue,
        clientNames: clientNames,
        status: "awaiting deposit",
        changeOrderIds: changeOrderIds,
        cashCountIds: cashCountIds,
      },
    ]);

  if (error) {
    console.error("Error inserting data:", error);
    return { error }; // Return error for handling outside
  }
  return { data: responseData }; // Return response data for success handling
};
export async function updateBankingStatus(clientIds: string[]) {
  const { data, error } = await supabase
    .from("banking")
    .update({ status: "pending deposit" }) // Set the new status
    .in("id", clientIds);
  if (error) {
    console.error("Error updating banking status:", error);
    return { error };
  }

  console.log("Updated records:", data);
  return { data };
}
// fetch the data from the deposit-bag table
export const getDepositBagData = async () => {
  const { data, error } = await supabase.from("deposit-bag").select("*");
  if (error) {
    console.error("Error getting deposit bag data", error);
  }
  return data;
};
export const getClients = async () => {
  const { data, error } = await supabase.from("clients").select("*");
  if (error) {
    console.error("Error getting clients", error);
  }
  return data;
};
