import { supabase } from "@/utils/supabaseClient";

export const insertCashProcessingCountedData = async (data: any, dateCounted: string, dateReceived: string, client: string, bankedGrandTotal: number, noteTotal: number, coinTotal: number, grandTotal: number, recycledNoteTotal: number,
    recycledCoinTotal: number, recycledGrandTotal: number, countDiscrepancyReason: string, bankedNotesTotal: number, bankedCoinTotal: number, clientCount: number) => {
        console.log(data);
        
        async function getNextId() {
            // Fetch the max cashCountId where cashCountId is not null
            const { data: maxIdData, error: maxIdError } = await supabase
                .from('cash-counted')
                .select('cashCountId')
                .not('cashCountId', 'is', null)
                .order('cashCountId', { ascending: false })
                .limit(1);
        
            // Log the error if there is one
            if (maxIdError) {
                console.error('Error fetching max ID:', maxIdError);
                return;
            }
        
            // Log the fetched data
            console.log('Fetched max ID data:', maxIdData);
        
            // Validate that data is not empty and cashCountId exists
            if (maxIdData && maxIdData.length > 0) {
                console.log('Max cashCountId:', maxIdData[0].cashCountId);
                const newId = maxIdData[0].cashCountId + 1;
                console.log('New ID:', newId);
                return newId;
            } else {
                console.log('No data found, starting with ID 1');
                return 1;
            }
        }
        const newId = await getNextId();
        if (newId === undefined) {
            console.error('Failed to get new ID.');
            return;
        }

    const cashOnHandData = {
        date: dateReceived,
        clientName: client,
        // hundred: parseInt(data.recycledCash[0]),
        fifty: parseInt(data.recycledCash[1]) || 0,
        twenty: parseInt(data.recycledCash[2]) || 0,
        ten: parseInt(data.recycledCash[3]) || 0,
        five: parseInt(data.recycledCash[4]) || 0,
        two: parseInt(data.recycledCash[5]) || 0,
        one: parseInt(data.recycledCash[6]) || 0,
        fiftyC: parseFloat(data.recycledCash[7]) || 0,
        twentyC: parseFloat(data.recycledCash[8]) || 0,
        tenC: parseFloat(data.recycledCash[9]) || 0,
        fiveC: parseFloat(data.recycledCash[10]) || 0,
        coinTotal: recycledCoinTotal || 0,
        noteTotal: recycledNoteTotal || 0,
        grandTotal: recycledGrandTotal || 0,
        status: 'credit'
    }
    const bankingData = {
        countDate: dateReceived,
        clientName: client,
        coinTotal: bankedCoinTotal,
        noteTotal: bankedNotesTotal,
        grandTotal: bankedGrandTotal,
        status: 'awaiting banking',
        cashCountId: newId
    }
    const cashCountedData = {
        countDate: dateCounted,
        clientName: client,
        hundred: parseInt(data.recycledCash[0]) || 0,
        fifty: parseInt(data.recycledCash[1]) || 0,
        twenty: parseInt(data.recycledCash[2]) || 0,
        ten: parseInt(data.recycledCash[3]) || 0,
        five: parseInt(data.recycledCash[4]) || 0,
        two: parseInt(data.recycledCash[5]) || 0,
        one: parseInt(data.recycledCash[6]) || 0,
        fiftyC: parseFloat(data.recycledCash[7]) || 0,
        twentyC: parseFloat(data.recycledCash[8]) || 0,
        tenC: parseFloat(data.recycledCash[9]) || 0,
        fiveC: parseFloat(data.recycledCash[10]) || 0,
        status: bankedGrandTotal > 0 ? 'awaiting banking' : 'client payable',
        coinTotal: coinTotal || 0,
        noteTotal: noteTotal || 0,
        grandTotal: grandTotal || 0,
        cashCountId: newId,
        countDiscrepancyReason: countDiscrepancyReason || '',
        clientCount: clientCount
    };
console.log("cash counted data", cashCountedData);
console.log("banking group", bankingData);
console.log("cash on hand data", cashOnHandData);



    let { error } = await supabase
        .from('cash-counted')
        .insert([cashCountedData]);

    if (error) {
        console.error('Error inserting data into cash-counted table:', error);
    }

    // // Insert data into 'banking' table
    if (bankedGrandTotal > 0) {
        const { error } = await supabase
            .from('banking')
            .insert([bankingData]);
    
        if (error) {
            console.error('Error inserting data into banking table:', error);
        }
    } else {
        console.log('bankedGrandTotal is not greater than 0, insert operation not triggered.');
    }

    // Insert data into 'cash-on-hand' table
    ({ error } = await supabase
        .from('cash-on-hand')
        .insert([cashOnHandData]))

    if (error) {
        console.error('Error inserting data into cash-on-hand table:', error);
    }

}