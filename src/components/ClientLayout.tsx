"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children, navbarData, footerData }: { children: React.ReactNode, navbarData?: any, footerData?: any }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  return (
    <>
      {!isStudio && <Navbar data={navbarData} />}
      <main>{children}</main>
      {!isStudio && <Footer data={footerData} />}
    </>
  );
}
