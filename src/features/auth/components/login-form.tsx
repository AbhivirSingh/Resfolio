"use client";

import { useState } from "react";
import { Lock, AlertCircle } from "lucide-react";

interface LoginFormProps {
    onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                onLogin();
            } else {
                const data = await res.json();
                setError(data.error || "Invalid credentials");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                <p className="text-gray-500 text-sm mt-2">Enter your credentials to access the dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Verifying..." : "Login"}
                </button>
            </form>
        </div>
    );
}
