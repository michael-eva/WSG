import { supabase } from "@/utils/supabaseClient";
import { formatDateForDB, getDate } from "@/utils/utils";
type ChangeOrderData = {
  client: { value: string; id?: number };
  dateReceived: Date;
  deliveryDate: Date;
  quantities: string[];
  run: string;
};

export const insertChangeData = async (
  data: ChangeOrderData,
  coinTotal: any,
  noteTotal: any,
  grandTotal: any
) => {
  const prepareDataForInsertion = (data: ChangeOrderData) => {
    return {
      clientName: data.client.value,
      orderDate: getDate(data.dateReceived),
      deliveryDate: getDate(data.deliveryDate),
      run: data.run,
      fifty: parseInt(data.quantities[0]),
      twenty: parseInt(data.quantities[1]),
      ten: parseInt(data.quantities[2]),
      five: parseInt(data.quantities[3]),
      two: parseInt(data.quantities[4]),
      one: parseInt(data.quantities[5]),
      fiftyC: parseFloat(data.quantities[6]),
      twentyC: parseFloat(data.quantities[7]),
      tenC: parseFloat(data.quantities[8]),
      fiveC: parseFloat(data.quantities[9]),
      coinTotal: coinTotal,
      noteTotal: noteTotal,
      grandTotal: grandTotal,
      status: "unprocessed", // Assuming a default status; adjust as necessary
    };
  };

  const preparedChangeData = prepareDataForInsertion(data);
  console.log(preparedChangeData);

  try {
    const { data: changeOrderResult, error: changeOrderError } = await supabase
      .from("change-order")
      .insert([preparedChangeData]);

    if (changeOrderError) {
      console.error(
        "Error inserting data into change-order table:",
        changeOrderError
      );
      return null;
    }

    return { changeOrderResult };
  } catch (error) {
    console.error("Error during data insertion:", error);
    return null;
  }
};

export const getChangeData = async () => {
  const { data, error } = await supabase.from("change-order").select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
};

export const getPendingChangeData = async () => {
  const { data, error } = await supabase
    .from("change-order")
    .select("id, deliveryDate, clientName, grandTotal, status, secondaryStatus")
    .or("status.eq.pending count,status.eq.unprocessed,status.eq.dispatched")
    .order("deliveryDate", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
};

export const getTotalCashOnHand = async () => {
  const { data, error } = await supabase
    .rpc("calculate_cash_on_hand_breakdown")
    .single();

  if (error) {
    console.error("Error calculating total cash on hand:", error);
    return null;
  }
  return data;
};

export const getDiscrepancies = async () => {
  const { data, error } = await supabase
    .from("change-order")
    .select(
      "id, clientName, grandTotal, guardReturnValue, guardDiscrepancyReason, countDiscrepancyReason, guard, deliveryDate"
    )
    .or(
      "secondaryStatus.eq.guard discrepancy,secondaryStatus.eq.count discrepancy"
    );

  if (error) {
    console.error("Error getting discrepancies:", error);
    return null;
  }
  return data;
};

export const getCountValueForDiscrepancy = async (ids: number[]) => {
  const { data, error } = await supabase
    .from("cash-counted")
    .select("id, clientName, grandTotal, changeOrderId")
    .in("changeOrderId", ids);

  if (error) {
    console.error("Error getting discrepancies:", error);
    return null;
  }
  return data;
};

export const getBankingData = async () => {
  const { data, error } = await supabase
    .from("banking")
    .select(
      "id, clientName, grandTotal, status, coinTotal, noteTotal, countDate, bankDate"
    )
    // .neq('status', 'banked');
    .eq("status", "awaiting banking");

  if (error) {
    console.error("Error getting banking data:", error);
    return null;
  }
  return data;
};
export const getDepositBagData = async () => {
  const { data, error } = await supabase
    .from("deposit-bag")
    .select(
      "bagId, value, status, created_at, clientNames, changeOrderIds, cashCountIds"
    )
    .eq("status", "awaiting deposit");

  if (error) {
    console.error("Error getting deposit bag data:", error);
    return null;
  }
  return data;
};
export const updateDepositBagStatus = async (bagId: string) => {
  const { data, error } = await supabase
    .from("deposit-bag")
    .update({ status: "deposited", dateReceived: new Date().toISOString() })
    .eq("bagId", bagId);

  if (error) {
    console.error("Error updating deposit bag status:", error);
    return null;
  }
  return data;
};

export const getClients = async () => {
  const { data, error } = await supabase.from("clients").select("name, id");

  if (error) {
    console.error("Error getting clients:", error);
    return null;
  }
  return data;
};
export const updateBankingCashCountStatus = async (cashCountId: number[]) => {
  const { data, error } = await supabase
    .from("banking")
    .update({ status: "deposited" })
    .in("cashCountId", cashCountId);

  if (error) {
    console.error("Error updating client status:", error);
    return null;
  }
  return data;
};
export const updateBankingChangeOrderStatus = async (
  changeOrderIds: number[]
) => {
  const { data, error } = await supabase
    .from("banking")
    .update({ status: "deposited" })
    .in("changeOrderId", changeOrderIds);

  if (error) {
    console.error("Error updating client status:", error);
    return null;
  }
  return data;
};
export const updateChangeOrderCashCountedStatus = async (
  changeOrderIds: number[]
) => {
  const { data, error } = await supabase
    .from("cash-counted")
    .update({ status: "completed" })
    .in("changeOrderId", changeOrderIds);

  if (error) {
    console.error("Error updating client status:", error);
    return null;
  }
  return data;
};
export const updateCashInputCashCountedStatus = async (
  cashInputIds: number[]
) => {
  const { data, error } = await supabase
    .from("cash-counted")
    .update({ status: "client payable" })
    .in("cashCountId", cashInputIds);

  if (error) {
    console.error("Error updating client status:", error);
    return null;
  }
  return data;
};

export async function insertCashOrderData(
  data: any,
  coinTotal: string,
  noteTotal: string,
  grandTotal: string
) {
  function prepareDataForInsertion(data: any) {
    return {
      name: "Armaguard",
      orderDate: getDate(data.dateReceived)
        ? data.dateReceived
        : getDate(new Date()),
      pickupDate: getDate(data.deliveryDate),
      fifty: parseInt(data.quantities[0]),
      twenty: parseInt(data.quantities[1]),
      ten: parseInt(data.quantities[2]),
      five: parseInt(data.quantities[3]),
      two: parseInt(data.quantities[4]),
      one: parseInt(data.quantities[5]),
      fiftyC: parseFloat(data.quantities[6]),
      twentyC: parseFloat(data.quantities[7]),
      tenC: parseFloat(data.quantities[8]),
      fiveC: parseFloat(data.quantities[9]),
      coinTotal: coinTotal,
      noteTotal: noteTotal,
      grandTotal: grandTotal,
      status: "placed",
    };
  }
  const preparedData = prepareDataForInsertion(data);
  const { data: cashOrderData, error } = await supabase
    .from("cash-order")
    .insert([preparedData]);
  if (error) {
    console.error(error);
    return null;
  }
  return cashOrderData;
}
export async function getCashOrderData() {
  const { data, error } = await supabase
    .from("cash-order")
    .select("*")
    .eq("status", "placed");
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

export async function getProcessedCash() {
  const { data, error } = await supabase
    .from("cash-counted")
    .select("countDate, clientName, status, grandTotal, created_at")
    .is("changeOrderId", null)
    .neq("status", "paid")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return null;
  }

  // Sort the data by date
  // const sortedData = data.sort((a, b) => {
  //   const dateA = new Date(a.countDate);
  //   const dateB = new Date(b.countDate);
  //   //@ts-ignore
  //   return dateB - dateA;
  // });

  // console.log(sortedData);
  return data;
}
// Function to check if EFT record exists and update or insert accordingly
export const handleEFTOrder = async (
  data: ChangeOrderData,
  coinTotal: any,
  noteTotal: any,
  grandTotal: any
) => {
  const { data: existingRecord, error: fetchError } = await supabase
    .from("change-order")
    .select("*")
    .eq("id", data.client.id)
    .eq("isEFT", true)
    .eq("status", "pending_eft_processing")
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching EFT record:", fetchError);
    return null;
  }

  const preparedData = {
    clientName: data.client.value,
    orderDate: getDate(data.dateReceived),
    deliveryDate: getDate(data.deliveryDate),
    run: data.run,
    fifty: parseInt(data.quantities[0]),
    twenty: parseInt(data.quantities[1]),
    ten: parseInt(data.quantities[2]),
    five: parseInt(data.quantities[3]),
    two: parseInt(data.quantities[4]),
    one: parseInt(data.quantities[5]),
    fiftyC: parseFloat(data.quantities[6]),
    twentyC: parseFloat(data.quantities[7]),
    tenC: parseFloat(data.quantities[8]),
    fiveC: parseFloat(data.quantities[9]),
    coinTotal: coinTotal,
    noteTotal: noteTotal,
    grandTotal: grandTotal,
    isEFT: true,
    status: "unprocessed",
  };

  if (existingRecord) {
    // Update existing record
    const { data: updateResult, error: updateError } = await supabase
      .from("change-order")
      .update(preparedData)
      .eq("id", existingRecord.id)
      .select();

    if (updateError) {
      console.error("Error updating EFT record:", updateError);
      return null;
    }

    return updateResult;
  } else {
    // Insert new record
    const { data: insertResult, error: insertError } = await supabase
      .from("change-order")
      .insert([preparedData]);

    if (insertError) {
      console.error("Error inserting EFT record:", insertError);
      return null;
    }

    return insertResult;
  }
};
