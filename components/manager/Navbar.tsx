"use client";

export default function Navbar() {
    return (
        <header className="h-16 bg-white shadow flex items-center justify-between px-8">

            <h2 className="font-semibold text-lg">
                Dashboard Manager
            </h2>

            <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
                Logout
            </button>

        </header>
    );
}