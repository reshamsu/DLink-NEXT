import Sidebar from "@/components/Sidebar";
// import Reserved from "@/components/Reserved";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="relative overflow-hidden">{children}</main>
      {/* <Reserved /> */}
    </>
  );
}
