import { jwtDecode } from 'jwt-decode';
import Link from "next/link";
import React from "react";

type Props = {};

export default function TestComponent({}: Props) {
  return (
    <div className="flex flex-col gap-8 items-center mt-8">
      <Link
        href=""
        className="  hover:text-white ease-in-out duration-150 text-sm md:text-base"
      >
        {jwtDecode<any>(localStorage.getItem("token") || "").name}
      </Link>
      <a
        href={`https://www.codervai.com/auth/register?redirect=${encodeURIComponent(window.location.href)}`}
        className=" md:px-8 px-4 py-2 rounded-lg bg-white bg-opacity-30 backdrop-blur-xl hover:text-white ease-in-out duration-150 text-sm md:text-base"
      >
        শুরু করুন
      </a>
    </div>
  );
}
