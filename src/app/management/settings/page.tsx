'use client'
import GuardDetails from "./(guard-details)/GuardDetails";

import Runs from "./Runs";

type Run = {
    id: number;
    name: string;
}

export default function Page() {
    return (
        <>
            <header>
                <h1>Settings</h1>
            </header>
            <section className="flex gap-10">
                <GuardDetails />
                <Runs />
            </section>
        </>
    );
}




