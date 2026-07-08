import SidebarCourier from "@/components/courier/SidebarCourier";

export default function CourierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarCourier />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}