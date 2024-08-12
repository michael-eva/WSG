// in useFloatData.ts (or wherever your useCashOnHand hook is defined)
import { useState, useEffect } from 'react';
import { getTotalCashOnHand } from "../utils";

export type CashOnHand = {
    totalfifty: string;
    totaltwenty: string;
    totalten: string;
    totalfive: string;
    totaltwo: string;
    totalone: string;
    totalfiftyc: string;
    totaltwentyc: string;
    totaltenc: string;
    totalfivec: string;
    totalgrandtotal: string;
    totalcointotal: string;
    totalnotetotal: string;
}

function useCashOnHand() {
    const [cashOnHand, setCashOnHand] = useState<CashOnHand | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCashOnHand() {
            try {
                setIsLoading(true);
                const data = await getTotalCashOnHand();
                setCashOnHand(data as CashOnHand);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while fetching cash on hand data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchCashOnHand();
    }, []);

    return { cashOnHand, isLoading, error };
}

export default useCashOnHand;