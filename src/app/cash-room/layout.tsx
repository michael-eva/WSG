import SideNav from "@/components/CashroomSidenav";

export default function CashRoomLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <SideNav />
            <div className=" p-8">
                {children}
            </div>
        </div>

    );
}