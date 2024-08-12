'use client'
import AuditHistory from "./audit-history";
import AuditInput from "./audit-input";
import Float from "./float";
import Discrepancies from "./discrepancies";

export default function page() {
    return (
        <div className="space-y-8">
            <Float />
            <Discrepancies />
            <div className="w-full flex gap-4 mt-8">
                <div className="w-1/2">
                    <AuditInput />
                </div>
                <div className="w-1/2">
                    <AuditHistory />
                </div>
            </div>

        </div>
    )
}