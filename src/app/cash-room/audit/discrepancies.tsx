import Discrepancy from "@/app/management/balance-sheet/Discrepancy"

import useDiscrepancyData from "./useDiscrepancyData";

export default function Discrepancies() {
    const { discrepancyData, isLoading, error } = useDiscrepancyData();
    return (
        <Discrepancy discrepancyData={discrepancyData} />
    )

}
