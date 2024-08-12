import { useState, useEffect } from 'react';
import { getCountValueForDiscrepancy, getDiscrepancies } from '../utils';

type DiscrepancyData = {
    id: number,
    clientName: string,
    grandTotal: number,
    countDiscrepancyReason?: string,
    guardDiscrepancyReason?: string,
    guardReturnValue?: number,
    countValue?: number,
    guard: string,
    deliveryDate: Date,
}
interface CashCountedData {
  changeOrderId: number;
  grandTotal: number;
}



function useDiscrepancyData() {
  const [discrepancyData, setDiscrepancyData] = useState<DiscrepancyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedDiscrepancies = await getDiscrepancies();

        if (fetchedDiscrepancies && fetchedDiscrepancies.length > 0) {
          const ids = fetchedDiscrepancies.map((item) => item.id);
          const cashCountedData = await getCountValueForDiscrepancy(ids);

          if (cashCountedData) {
            const combinedData = fetchedDiscrepancies.map(discrepancy => {
              const matchingCashCounted = cashCountedData.find(
                (cashCounted) => cashCounted.changeOrderId === discrepancy.id
              );
              return {
                ...discrepancy,
                countValue: matchingCashCounted ? matchingCashCounted.grandTotal : undefined
              };
            });

            setDiscrepancyData(combinedData);
          } else {
            setDiscrepancyData(fetchedDiscrepancies);
          }
        } else {
          setDiscrepancyData([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
const discrepancyTotal = discrepancyData.reduce((acc, item) => acc + item.grandTotal, 0);
  return { discrepancyData, isLoading, error, discrepancyTotal };
}

export default useDiscrepancyData;