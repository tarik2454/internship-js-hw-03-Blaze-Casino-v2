import { Header } from "@/module/header/Header";
import ProtectedLayout from "../providers/ProtectedLayout";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <main>
        <Header />
        {children}
      </main>
    </ProtectedLayout>
  );
}
