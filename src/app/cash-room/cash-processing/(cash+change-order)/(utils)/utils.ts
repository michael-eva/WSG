import { supabase } from "@/utils/supabaseClient";
import { stat } from "fs";

export const getChangeData = async (id: string) => {
  const { data, error } = await supabase
    .from("change-order")
    .select(
      "id,clientName, orderDate, deliveryDate, grandTotal, guardReturnValue, guardDiscrepancyReason"
    )
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
};

export const insertCashCount = async (
  data: any,
  date: string | undefined | null,
  client: string,
  bankedGrandTotal: number,
  noteTotal: number,
  coinTotal: number,
  grandTotal: number,
  recycledNoteTotal: number,
  recycledCoinTotal: number,
  recycledGrandTotal: number,
  changeOrderId: string,
  countDiscrepancyReason: string,
  bankedNotesTotal: number,
  bankedCoinTotal: number
) => {
  const cashOnHandData = {
    date: date,
    clientName: client,
    fifty: parseInt(data.recycledCash[0]),
    twenty: parseInt(data.recycledCash[1]),
    ten: parseInt(data.recycledCash[2]),
    five: parseInt(data.recycledCash[3]),
    two: parseInt(data.recycledCash[4]),
    one: parseInt(data.recycledCash[5]),
    fiftyC: parseFloat(data.recycledCash[6]),
    twentyC: parseFloat(data.recycledCash[7]),
    tenC: parseFloat(data.recycledCash[8]),
    fiveC: parseFloat(data.recycledCash[9]),
    coinTotal: recycledCoinTotal,
    noteTotal: recycledNoteTotal,
    grandTotal: recycledGrandTotal,
    status: "credit",
  };
  const bankingData = {
    countDate: date,
    clientName: client,
    coinTotal: bankedCoinTotal,
    noteTotal: bankedNotesTotal,
    grandTotal: bankedGrandTotal,
    status: "awaiting banking",
    changeOrderId: changeOrderId,
  };
  const cashCountedData = {
    countDate: date,
    clientName: client,
    fifty: parseInt(data.countedCash[0]),
    twenty: parseInt(data.countedCash[1]),
    ten: parseInt(data.countedCash[2]),
    five: parseInt(data.countedCash[3]),
    two: parseInt(data.countedCash[4]),
    one: parseInt(data.countedCash[5]),
    fiftyC: parseFloat(data.countedCash[6]),
    twentyC: parseFloat(data.countedCash[7]),
    tenC: parseFloat(data.countedCash[8]),
    fiveC: parseFloat(data.countedCash[9]),
    status: bankedGrandTotal > 0 ? "awaiting banking" : "completed",
    coinTotal: coinTotal,
    noteTotal: noteTotal,
    grandTotal: grandTotal,
    changeOrderId: changeOrderId,
  };
  let { error } = await supabase.from("cash-on-hand").insert([cashOnHandData]);

  if (bankedGrandTotal > 0) {
    const { error } = await supabase.from("banking").insert([bankingData]);

    if (error) {
      console.error("Error inserting data into banking table:", error);
    }
  } else {
    console.log(
      "bankedGrandTotal is not greater than 0, insert operation not triggered."
    );
  }

  if (error) {
    console.error("Error inserting data into cash-on-hand table:", error);
  }

  // Insert data into 'cash-counted' table
  ({ error } = await supabase.from("cash-counted").insert([cashCountedData]));

  if (error) {
    console.error("Error inserting data into cash-counted table:", error);
  }
  const updateData = {
    status: "processed",
    ...(countDiscrepancyReason &&
      countDiscrepancyReason.length > 0 && {
        countDiscrepancyReason,
        secondaryStatus: "count discrepancy",
      }),
  };
  const updateError = await supabase
    .from("change-order")
    .update(updateData)
    .eq("id", changeOrderId);

  if (error) {
    console.error("Error inserting data into cash-counted table:", updateError);
  }
};
export const getCashOrderData = async (id: string) => {
  const { data, error } = await supabase
    .from("cash-order")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
};
export const insertCashOrderCount = async (
  data: any,
  date: string | undefined | null,
  client: string,
  noteTotal: number,
  coinTotal: number,
  grandTotal: number,
  cashOrderId: string,
  countDiscrepancyReason: string
) => {
  // Insert data into 'cash-counted' table
  const cashCountedData = {
    countDate: date,
    clientName: client,
    fifty: parseInt(data.countedCash[0]),
    twenty: parseInt(data.countedCash[1]),
    ten: parseInt(data.countedCash[2]),
    five: parseInt(data.countedCash[3]),
    two: parseInt(data.countedCash[4]),
    one: parseInt(data.countedCash[5]),
    fiftyC: parseFloat(data.countedCash[6]),
    twentyC: parseFloat(data.countedCash[7]),
    tenC: parseFloat(data.countedCash[8]),
    fiveC: parseFloat(data.countedCash[9]),
    status: "counted",
    coinTotal: coinTotal,
    noteTotal: noteTotal,
    grandTotal: grandTotal,
    // discrepancyReason: countDiscrepancyReason,
    cashOrderId: cashOrderId,
  };
  const cashOnHandData = {
    date: date,
    clientName: client,
    fifty: parseInt(data.countedCash[0]),
    twenty: parseInt(data.countedCash[1]),
    ten: parseInt(data.countedCash[2]),
    five: parseInt(data.countedCash[3]),
    two: parseInt(data.countedCash[4]),
    one: parseInt(data.countedCash[5]),
    fiftyC: parseFloat(data.countedCash[6]),
    twentyC: parseFloat(data.countedCash[7]),
    tenC: parseFloat(data.countedCash[8]),
    fiveC: parseFloat(data.countedCash[9]),
    coinTotal: coinTotal,
    noteTotal: noteTotal,
    grandTotal: grandTotal,
    status: "credit",
  };
  let { error } = await supabase.from("cash-counted").insert([cashCountedData]);

  if (error) {
    console.error("Error inserting data into cash-counted table:", error);
  }
  ({ error } = await supabase.from("cash-on-hand").insert([cashOnHandData]));

  if (error) {
    console.error("Error inserting data into cash-on-hand table:", error);
  }
  //update the status for the cash order
  const updateData = {
    status: "processed",
  };
  const updateError = await supabase
    .from("cash-order")
    .update(updateData)
    .eq("id", cashOrderId);
  if (error) {
    console.error("Error inserting data into cash-counted table:", updateError);
  }
};
