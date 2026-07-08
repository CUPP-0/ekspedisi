import Sidebar from "@/components/manager/Sidebar";
import Navbar from "@/components/manager/Navbar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">

            <Sidebar />

            <div className="flex-1 bg-gray-100 min-h-screen">

                <Navbar />

                <main className="p-6">

                    {children}

                </main>

            </div>

        </div>
    );
}