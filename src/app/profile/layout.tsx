import type { ReactNode } from "react";
import AppNavbar from "@/components/AppNavbar";

type ProfileLayoutProps = {
  children: ReactNode;
};

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-page-bg text-foreground">
      <AppNavbar />
      <main className="mx-auto w-[92%] max-w-5xl pb-16 pt-28 md:w-[88%]">
        {children}
      </main>
    </div>
  );
}
