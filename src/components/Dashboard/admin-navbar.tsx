'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import Image from 'next/image';

type AdminNavbarProps = {
  currentPage: string;
}

export function AdminNavbar({ currentPage }: AdminNavbarProps) {
    const [wallet, setWallet] = useState<string>("");

    useEffect(() => {
        const wallet = localStorage.getItem("wallet");
        setWallet(wallet ? wallet : '');
    }, []);

    return (
        <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-white text-4xl font-bold">{currentPage}</h1>
          <p className="text-white text-lg">
            Welcome back, <strong>Caique</strong>
          </p>
        </div>

          <div className="rounded-full p-2">
            <Link href="/settings">
              <Image
                src={generateAvatarURL(wallet)}
                width="40"
                height="40"
                alt={wallet}
                className="w-10 h-10 rounded-full"
              />
            </Link>
          </div>
      </div>
    )
}