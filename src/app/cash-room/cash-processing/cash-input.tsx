import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CashInput() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2">
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">$50</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">$20</div>

                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">$10</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">$5</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                        Note Total: $0.00
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-5 gap-2">
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">$2</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">$1</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">50c</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">20c</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                            <div className="text-lg font-semibold">10c</div>
                            <Input className="w-full mt-2" placeholder="Quantity" type="number" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                        Coin Total: $0.00
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-lg font-semibold dark:bg-gray-800">
                Grand Total: $0.00
            </div>
            <Button className=" w-72 flex">Submit</Button>
        </div>
    )
}
