import { AdminNavbar } from "@/components/Dashboard/admin-navbar";

export default function Automations() {
    return (
      <div className="min-h-screen flex flex-1 flex-col overflow-y-scroll">
        <section className="bg-cyan-950 h-2/5 flex flex-col items-stretch justify-start px-14 py-2">
          <AdminNavbar currentPage="Automations" />
        </section>

        <section className="flex-1 -mt-20 grid h-3/5 px-14">
          <div className="bg-white h-96 overflow-hidden rounded-md shadow-md parent flex flex-col items-stretch justify-between flex-1">
            <h2 className="px-5 py-3 font-medium text-sm h-[10%]">Card tables</h2>
            <table className="child table-auto text-sm flex flex-col flex-1 h-[90%]">
                <thead className="bg-gray-100 text-left uppercase">
                    <tr className="flex w-full">
                        <th scope="col" className="px-5 py-2 w-1/5">Project</th>
                        <th scope="col" className="px-5 py-2 w-1/5">Budget</th>
                        <th scope="col" className="px-5 py-2 w-1/5">Status</th>
                        <th scope="col" className="px-5 py-2 w-1/5">Users</th>
                        <th scope="col" className="px-5 py-2 w-1/5">Completion</th>
                        </tr>
                </thead>
                <tbody className="text-left flex flex-col items-start overflow-y-scroll">
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-6 w-1/5 font-bold">Facebook</td>
                        <td scope="col" className="px-5 py-6 w-1/5">1394</td>
                        <td scope="col" className="px-5 py-6 w-1/5 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-orange-500"></div>
                          pending
                        </td>
                        <td scope="col" className="px-5 py-6 w-1/5">10%</td>
                        <td scope="col" className="px-5 py-6 w-1/5">10%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-6 w-1/5 font-bold">Google</td>
                        <td scope="col" className="px-5 py-6 w-1/5">19394</td>
                        <td scope="col" className="px-5 py-6 w-1/5 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-red-500"></div>
                          delayed
                        </td>
                        <td scope="col" className="px-5 py-6 w-1/5">1394</td>
                        <td scope="col" className="px-5 py-6 w-1/5">10%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-6 w-1/5 font-bold">Instagram</td>
                        <td scope="col" className="px-5 py-6 w-1/5">355</td>
                        <td scope="col" className="px-5 py-6 w-1/5 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-emerald-400"></div>
                          completed
                        </td>
                        <td scope="col" className="px-5 py-6 w-1/5">1394</td>
                        <td scope="col" className="px-5 py-6 w-1/5">10%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-6 w-1/5 font-bold">X</td>
                        <td scope="col" className="px-5 py-6 w-1/5">743</td>
                        <td scope="col" className="px-5 py-6 w-1/5 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-sky-500"></div>
                          on schedule
                        </td>
                        <td scope="col" className="px-5 py-6 w-1/5">1394</td>
                        <td scope="col" className="px-5 py-6 w-1/5">10%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-6 w-1/5 font-bold">X</td>
                        <td scope="col" className="px-5 py-6 w-1/5">743</td>
                        <td scope="col" className="px-5 py-6 w-1/5 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-sky-500"></div>
                          on schedule
                        </td>
                        <td scope="col" className="px-5 py-6 w-1/5">1394</td>
                        <td scope="col" className="px-5 py-6 w-1/5">10%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-6 w-1/5 font-bold">X</td>
                        <td scope="col" className="px-5 py-6 w-1/5">743</td>
                        <td scope="col" className="px-5 py-6 w-1/5 flex items-center gap-2">
                          <div className="rounded-full h-2 w-2 bg-sky-500"></div>
                          on schedule
                        </td>
                        <td scope="col" className="px-5 py-6 w-1/5">1394</td>
                        <td scope="col" className="px-5 py-6 w-1/5">10%</td>
                    </tr>
                </tbody>
            </table>
           </div>
        </section>
      </div>
    );
  }
  