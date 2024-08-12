export function Dialog({ setIsOpen, children, setIsCashProcessing }: { setIsOpen: any, children: any, setIsCashProcessing?: any }) {
    const closeDialog = () => { setIsOpen(false), setIsCashProcessing ? setIsCashProcessing(false) : null }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[60vw] max-h-[100vh] overflow-auto">
                <div className="flex justify-end">
                    <div
                        onClick={closeDialog}
                        className="px-2 border rounded border-transparent cursor-pointer hover:border-gray-500"
                    >
                        X
                    </div>
                </div>
                <div className="min-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    )
}