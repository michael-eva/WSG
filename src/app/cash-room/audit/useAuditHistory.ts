import { supabase } from "@/utils/supabaseClient"
import { useEffect, useState } from "react"
type AuditHistory={
created_at: Date,
id: number,
value: number,
discrepancy: number,
denomination_value: Record<string, string>,
}
export default function useAuditHistory() {
    const [auditHistory, setAuditHistory] = useState<AuditHistory[]>([])

    useEffect(() => {
        getAuditHistory()
    }, [])

    const getAuditHistory = async () => {
        const {data, error} = await supabase
            .from('audit')
            .select('*')
            .order('id', { ascending: false })
        if (error) throw error
        setAuditHistory(data as AuditHistory[]) 
    }
    return {auditHistory}
}
