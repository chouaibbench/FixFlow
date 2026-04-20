import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api"; 
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";

export const TechnicianSettings = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const updated = await api.put(`/users/${user.id}`, { name, email });
            setUser(updated);
            setStatus({ type: 'success', message: 'Profile updated successfully' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message ?? 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-3xl font-bold">Settings</h2>
                <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.email ?? '')}`}
                                fallback={user?.name?.[0]}
                                className="h-20 w-20"
                            />
                            <div>
                                <p className="font-medium text-sm text-slate-700">Profile Picture</p>
                                <p className="text-xs text-slate-500 mt-1">Auto-generated based on your email</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Role</label>
                                <Input value={user?.role ?? ''} disabled className="capitalize opacity-60" />
                            </div>
                        </div>

                        {status.message && (
                            <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {status.message}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" isLoading={isLoading}>Save Changes</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setName(user?.name ?? '');
                                    setEmail(user?.email ?? '');
                                    setStatus({ type: '', message: '' });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
