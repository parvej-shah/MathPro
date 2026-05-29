"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";

export default function AppNavbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return <Nav mode={isLanding ? "landing" : "default"} />;
}
