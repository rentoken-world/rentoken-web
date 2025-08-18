'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { DefaultCard } from "@/components/default-card";
import { useEffect, useState, Suspense } from "react";
import { activate, signOut } from "@/services/auth-service";

function ActivateContent() {
    const { push } = useRouter();
    const searchParams = useSearchParams();

    const [token, setToken] = useState<string>(searchParams.get('token') || '');
    const [wallet, setWallet] = useState<string>(searchParams.get('wallet') || '');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if(token && token.length === 6 && wallet) {
            activate(wallet, token)
            .then(jwt => {
                localStorage.setItem('token', jwt);
                push(`/pay/${wallet}`);
            })
            .catch(err => setMessage(err.response ? JSON.stringify(err.response.data) : err.message));
            return;
        } else if(!wallet) {
            const address = localStorage.getItem('wallet');
            if(address) {
                setWallet(address);
            } else {
                signOut();
            }
        }
    }, [push, token, wallet]);


    function btnActivateClick() {
        if(!token || token.length < 6) {
            setMessage('The activation code must have 6 digits');
            return;
        }
        setMessage('Activating. Wait...');
        const address = localStorage.getItem('wallet');
        if(!address) {
            signOut();
            return;
        }
        activate(wallet, token)
        .then(jwt => {
            localStorage.setItem('token', jwt);
            push(`/pay/${wallet}`);
        })
        .catch(err => setMessage(err.response ? JSON.stringify(err.response.data) : err.message));
        return;
    }

    return (
        <div className="relative flex flex-col h-screen items-center justify-center">
            <DefaultCard>
                <div className="flex flex-col items-center justify-center gap-6">
                    <Image src="/img/poseidon_logo.png" alt="Google" width={150} height={150} />
                    Type the token you received in your email
                    <form className="w-full flex flex-col gap-4" action={btnActivateClick}>

                        <div className="flex flex-col justify-start gap-1">
                            <label htmlFor="name">TOKEN</label>
                            <input
                            id="name"
                            type="number"
                            placeholder="Your activation token (6 digits)"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            className="p-4 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>

                    <button
                        className="bg-sky-900 p-4 rounded-sm self-stretch text-gray-100 text-sm flex items-center justify-center gap-4 hover:bg-sky-950"
                        type="submit"
                    >
                        ACTIVATE ACCOUNT
                    </button>
                    { message && <span className="text-gray-800 text-sm font-normal">{message}</span>}
                    </form>
                </div>
            </DefaultCard>
            <Link href="/login" className="mt-4">
                <span className="text-gray-300 text-sm font-semibold">Back to login</span>
            </Link>
        </div>
    )
}

export default function Activate() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <ActivateContent />
        </Suspense>
    );
}