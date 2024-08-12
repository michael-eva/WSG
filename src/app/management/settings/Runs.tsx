import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
;
type Run = {
    id: number;
    name: string;
}

export default function Runs() {
    const [isNewRun, setIsNewRun] = useState<boolean>(false);
    const [runName, setRunName] = useState<string>("");
    const [runs, setRuns] = useState<Run[]>([]);

    useEffect(() => {
        getRuns();
    }, []);

    const getRuns = async () => {
        const { data, error } = await supabase
            .from('runs')
            .select('id, name'); // Ensure 'id' is included in the selection

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setRuns(data as Run[]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('runs') // Ensure this is the correct table name
            .insert({ name: runName });

        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully:', data);
            setRunName("");
            getRuns(); // Refresh the runs list after insertion
        }
    };

    return (
        <>
            <RunList runs={runs} setIsNewRun={setIsNewRun} isNewRun={isNewRun} />
            {isNewRun && (
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Run Details</CardTitle>
                        <CardDescription>Enter run details below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="runName">Run Name</Label>
                                <Input
                                    id="runName"
                                    placeholder="Run name"
                                    value={runName}
                                    onChange={(e) => setRunName(e.target.value)}
                                />
                            </div>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" type="button" onClick={() => setIsNewRun(false)}>Cancel</Button>
                                <Button type="submit">Deploy</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
function RunList({ runs, setIsNewRun, isNewRun }: { runs: Run[], setIsNewRun: React.Dispatch<React.SetStateAction<boolean>>, isNewRun: boolean }) {
    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Run Name</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {runs.map((run) => (
                        <TableRow key={run.id}>
                            <TableCell className="font-medium w-[100px]">{run.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={() => setIsNewRun(!isNewRun)}>Enter new run</Button>
        </div>
    );
}