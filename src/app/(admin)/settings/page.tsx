'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/Dashboard/admin-navbar";
import { Alert } from "@/components/Alert";
import { getUser, updateUser } from "@/services/user-service";
import { User } from "commons/models/user";
import { getJwt } from "@/services/auth-service";

export default function Settings() {
    const [user, setUser] = useState<User>({} as User);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { push } = useRouter();

    useEffect(() => {
        const jwt = getJwt();
        if(!jwt) {
            push('/');
            return;
        }
        getUser(jwt.address)
        .then(user => setUser({...user, privateKey: ''}))
        .catch(err => setError(err.message ? err.response.data : err.message));
    }, [push]);

    function onUserChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser((prevState: any) => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    async function handleSubmit() {
        setIsLoading(true);
        const jwt = getJwt();
        if(!jwt) {
            push('/');
            return;
        }
        updateUser(jwt.userId, user)
        .then(user => {
            setUser({...user, privateKey: ''});
            setMessage('Settings saved successfully');
            setIsLoading(false);
        })
        .catch(err => {
            setError(err.message ? err.response.data : err.message);
            setIsLoading(false);
        });
    }
    return (
      <div className="min-h-screen flex flex-1 flex-col overflow-y-scroll">
        <section className="bg-cyan-950 h-2/5 flex flex-col items-stretch justify-start px-14 py-2">
          <AdminNavbar currentPage="Settings" />
        </section>

        <section className="flex-1 -mt-56 grid h-3/5 px-14">
          <div className="bg-white h-fit rounded-md shadow-md parent flex flex-col items-stretch justify-between flex-1">
                <div className="px-7 py-4 flex items-center justify-between">
                    <h2 className="font-medium text-sm h-[10%]">My account</h2>
                    <button className="bg-sky-500 text-white rounded-sm px-3 py-1 font-semibold text-sm hover:bg-sky-600" onClick={handleSubmit}>
                        {
                            isLoading ? 'Saving...' : 'Save Settings'
                        }
                    </button>
                </div>

                { message || error
                    ? <Alert isError={!message} message={error ? error : message} />
                    : <></> 
                }
                
                <form className="w-full flex flex-col bg-gray-100 flex-1 py-4 px-8 divide-y">
                    <div className="flex flex-col gap-2 pb-5">
                        <h3 className="text-sm text-gray-500 uppercase">User Information</h3>
                        <div className="flex flex-col justify-start gap-1 w-1/2">
                            <label htmlFor="email">NAME</label>
                            <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={user.name || ''}
                            onChange={onUserChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />

                            <label className="mt-4" htmlFor="email">EMAIL</label>
                            <input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            value={user.email || ''}
                            onChange={onUserChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />

                            <label className="mt-4" htmlFor="email">PLAN</label>
                            <input
                            id="planId"
                            type="string"
                            placeholder="Your chosen plan"
                            value={user.planId || ''}
                            disabled={true}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-5">
                        <h3 className="text-sm text-gray-500 uppercase">Wallet Information</h3>
                        <div className="flex flex-col justify-start gap-1 w-1/2">
                        <label htmlFor="email">NETWORK</label>
                            <input
                            id="network"
                            type="number"
                            placeholder="Choose a network"
                            value={user.network || ''}
                            onChange={onUserChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />

                            <label className="mt-4" htmlFor="email">ADDRESS</label>
                            <input
                            id="address"
                            type="address"
                            placeholder="Insert your wallet address"
                            value={user.address || ''}
                            onChange={onUserChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />

                            <label className="mt-4" htmlFor="email">PRIVATE KEY</label>
                            <input
                            id="privateKey"
                            type="password"
                            placeholder="Insert your private key for operations"
                            value={user.privateKey || ''}
                            onChange={onUserChange}
                            className="p-2 rounded-sm bg-gray-200 border border-white focus:bg-white focus:outline-none font-light" />
                        </div>
                    </div>
                </form>
           </div>
        </section>
      </div>
    );
  }
  