import SidebarManager from "@/components/manager/SidebarManager";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <SidebarManager />

      <main className="flex-1 overflow-y-auto p-6">

        {children}

      </main>

    </div>
  );
}