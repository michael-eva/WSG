'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

type GuardDetails = {
    id: number; // Assuming you have an id field to uniquely identify each guard
    firstName: string;
    lastName: string;
    fullName: string;
};

type GuardListProps = {
    setIsEnterGuard: React.Dispatch<React.SetStateAction<boolean>>;
    isEnterGuard: boolean;
    guards: GuardDetails[];
    deleteGuard: (id: number) => Promise<void>; // Add deleteGuard function to props
};

export default function GuardDetailsComponent() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [isEnterGuard, setIsEnterGuard] = useState<boolean>(false);
    const [guards, setGuards] = useState<GuardDetails[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fullName = `${firstName} ${lastName}`;

        const { data, error } = await supabase
            .from('guard-details') // Ensure this is the correct table name
            .insert([{ firstName, lastName, fullName }]);

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully:', data);
            setFirstName("");
            setLastName("");
            getGuards(); // Refresh the guards list after insertion
        }
    };

    useEffect(() => {
        getGuards();
    }, []);

    const getGuards = async () => {
        const { data, error } = await supabase
            .from('guard-details')
            .select('id, firstName, lastName, fullName'); // Ensure 'id' is included in the selection

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setGuards(data as GuardDetails[]);
        }
    };

    const deleteGuard = async (id: number) => {
        const { error } = await supabase
            .from('guard-details')
            .delete()
            .eq('id', id); // Delete the guard based on id

        if (error) {
            console.error('Error deleting data:', error);
        } else {
            getGuards(); // Refresh the guards list after deletion
        }
    };

    return (
        <>
            <GuardList isEnterGuard={isEnterGuard} setIsEnterGuard={setIsEnterGuard} guards={guards} deleteGuard={deleteGuard} />
            {isEnterGuard && (
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Guard Details</CardTitle>
                        <CardDescription>Enter guard details below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5 w-full">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" type="button" onClick={() => setIsEnterGuard(false)}>Cancel</Button>
                                <Button type="submit">Deploy</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            )}
        </>
    );
}

function GuardList({ setIsEnterGuard, isEnterGuard, guards, deleteGuard }: GuardListProps) {
    return (
        <div>
            <h1>Guard List</h1>
            <ul className="flex flex-col gap-4">
                {guards.map((guard) => (
                    <li key={guard.id} className="flex gap-10">
                        {guard.fullName}
                        <Button variant="destructive" onClick={() => deleteGuard(guard.id)} className="h-6">Delete</Button>
                    </li>
                ))}
            </ul>
            <Button onClick={() => setIsEnterGuard(!isEnterGuard)}>Enter new guard</Button>
        </div>
    );
}
