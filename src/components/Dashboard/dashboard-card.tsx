function DashboardCard({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
    <div className="bg-white shadow-sm shadow-gray-600 rounded-sm p-3 font-bold flex-1">
        {children}
    </div>
    );
}

export { DashboardCard }