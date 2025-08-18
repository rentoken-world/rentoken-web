/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-17 21:37:14
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 00:42:32
 * @FilePath: /auto_dex/frontend/src/components/Sidebar/index.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Computer, PrecisionManufacturing, Settings, Logout } from '@mui/icons-material';

export function Sidebar() {
      const pathname = usePathname();
      const { push } = useRouter();

      function btnLogoutClick(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        localStorage.clear();
        push('/login');
      }
      
    return (
        <div className="bg-white w-1/6 shadow-lg p-8 flex flex-col justify-start items-start divide-y">
            <h2 className="text-xl font-bold uppercase text-cyan-900 pb-8">Poseidon</h2>

            <div className="flex flex-col w-full pt-8">
                <ul className="uppercase text-sm text-gray-500 font-semibold">
                    <li className="p-2">
                        <Link className={`${pathname === '/dashboard' && "text-blue-500"} flex items-end gap-2`} href="/dashboard">
                            <Computer />
                            Dashboard
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/automations' && "text-blue-500"} flex items-end gap-2`} href="/automations">
                            <PrecisionManufacturing />
                            Automations
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/settings' && "text-blue-500"} flex items-end gap-2`} href="/settings">
                            <Settings />
                            Settings
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link
                        className={`${pathname === '/logout' && "text-blue-500"} flex items-end gap-2`}
                        href="#"
                        onClick={btnLogoutClick}
                        >
                            <Logout />
                            Logout
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link
                        className={`${pathname === '/logout' && "text-blue-500"} flex items-end gap-2`}
                        href="#"
                        onClick={btnLogoutClick}
                        >
                            <Logout />
                            Logout
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/kyc' && "text-blue-500"} flex items-end gap-2`} href="/kyc">
                            <span className="material-icons">verified_user</span>
                            实名认证
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/mint' && "text-blue-500"} flex items-end gap-2`} href="/mint">
                            <span className="material-icons">add_circle_outline</span>
                            铸造（Mint）
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/swap' && "text-blue-500"} flex items-end gap-2`} href="/swap">
                            <span className="material-icons">swap_horiz</span>
                            兑换（Swap）
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/redeem' && "text-blue-500"} flex items-end gap-2`} href="/redeem">
                            <span className="material-icons">redeem</span>
                            赎回（Redeem）
                        </Link>
                    </li>
                </ul>
            </div>
            
        </div>
    )
}