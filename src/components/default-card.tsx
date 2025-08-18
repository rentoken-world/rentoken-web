function DefaultCard({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="bg-gray-300 shadow-md shadow-gray-600 rounded-md p-6 text-gray-700 font-bold">
            {children}
    </div>
    );
}

export { DefaultCard }