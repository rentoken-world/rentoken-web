export function SocialTrafficCard() {
    return (
        <div className="parent flex flex-col items-stretch justify-between flex-1 h-96">
            <h2 className="px-5 py-3 font-medium text-sm h-[10%]">Social traffic</h2>
            <table className="child table-auto text-sm flex flex-col flex-1 h-[90%]">
                <thead className="bg-gray-100 text-left uppercase">
                    <tr className="flex w-full">
                        <th scope="col" className="px-5 py-2 w-1/3">Referral</th>
                        <th scope="col" className="px-5 py-2 w-1/3">Visitors</th>
                        <th scope="col" className="px-5 py-2 w-1/3"></th>
                        </tr>
                </thead>
                <tbody className="text-left flex flex-col items-start overflow-y-scroll">
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-2 w-1/3 font-bold">Facebook</td>
                        <td scope="col" className="px-5 py-2 w-1/3">1394</td>
                        <td scope="col" className="px-5 py-2 w-1/3">10%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-2 w-1/3 font-bold">Google</td>
                        <td scope="col" className="px-5 py-2 w-1/3">19394</td>
                        <td scope="col" className="px-5 py-2 w-1/3">86%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-2 w-1/3 font-bold">Instagram</td>
                        <td scope="col" className="px-5 py-2 w-1/3">355</td>
                        <td scope="col" className="px-5 py-2 w-1/3">2,5%</td>
                    </tr>
                    <tr className="flex w-full">
                        <td scope="col" className="px-5 py-2 w-1/3 font-bold">X</td>
                        <td scope="col" className="px-5 py-2 w-1/3">743</td>
                        <td scope="col" className="px-5 py-2 w-1/3">3,5%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}