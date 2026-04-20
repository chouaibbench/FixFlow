import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api"; 
import { useState } from "react";


export const TechnicianSettings = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await api.put(`/users/${user.id}`, { name, email });
            setUser(updated);
            setStatus('Saved successfully');
        } catch (err) {
            setStatus(err.message ?? 'something went wrong');
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <h2>Profile Settings</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
    )
};