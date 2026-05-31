import React from "react";
import { HindSiliguri } from "@/helpers";
import { Toaster } from "react-hot-toast";

type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Props) {
    return (
        <div className={`${HindSiliguri.variable} overflow-x-hidden font-hind min-h-screen flex flex-col`}>
            <Toaster />

            <div className="flex-grow bg-page-bg">{children}</div>
        </div>
    );
}
