'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter} from 'next/navigation';
import { DefaultCard } from "@/components/default-card";
import { useState } from "react";
import { getWallet } from "@/services/web3service";
import { signUp } from "@/services/auth-service";
import { User } from "commons/models/user";

type UserProps = {
    name: string;
    email: string;
}

export default function Register() {
    const { push } = useRouter();

    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<UserProps>({
        name: "",
        email: "",
    } as UserProps);

    function onUserChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser((prevState: any) => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    async function btnRegisterClick() {
        setMessage("Registering...");

        let wallet = localStorage.getItem("wallet");
        if(!wallet) {
            try {
                wallet = await getWallet();
            } catch (error) {
                setMessage((error as Error).message);
                return;
            }
        }

        try {
            await signUp({
                name: user.name,
                email: user.email,
                address: wallet,
                planId: "Gold"
            } as User);
        } catch (err: any) {
            setMessage(err.response ? JSON.stringify(err.response.data) : err.message);
        }

        push(`/register/activate?wallet=${wallet}`);
    }

    return (
        <div className="relative flex flex-col h-screen items-center justify-center">
            <DefaultCard>
                <div className="flex flex-col items-center justify-center gap-6">
                    <Image src="/img/poseidon_logo.png" alt="Google" width={150} height={150} />
                    Sign up filling form bellow. Your wallet will prompt to save
                    <form className="w-full flex flex-col gap-4" action={btnRegisterClick}>

                        <div className="flex flex-col justify-start gap-1">
                            <label htmlFor="name">NAME</label>
                            <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={user ? user?.name : ''}
                            onChange={onUserChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>

                        <div className="flex flex-col justify-start gap-1">
                            <label htmlFor="email">EMAIL</label>
                            <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={user ? user?.email : ''}
                            onChange={onUserChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>
                    <button
                        className="bg-sky-900 p-4 rounded-sm self-stretch text-gray-100 text-sm flex items-center justify-center gap-4 hover:bg-sky-950"
                        type="submit"
                    >
                        CREATE ACCOUNT
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