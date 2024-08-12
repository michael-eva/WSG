import SideNav from "@/components/ManagementSidenav";

export default function ManagementLayout({
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