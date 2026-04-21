import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../lib/api";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { LanguageSelector } from "../../components/LanguageSelector";

export const WorkerSettings = () => {
    const { user, setUser } = useAuth();
    const { t } = useLanguage();
    const [ name, setName ] = useState(user?.name ?? '');
    const [ email, setEmail ] = useState(user?.email ?? '');
    const [ isEditing, setIsEditing ] = useState(false);
    const [ isLoading, setIsLoading] = useState(false);
    const [ status, setStatus] = useState({ type: '', message: ''});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type:'', message: ''});
        try {
            const updated = await api.put(`/users/${user.id}`, {name, email});
            setUser(updated);
            setStatus({ type : 'success' , message: 'Profile updated successfully'});
            setIsEditing(false);
        } catch (err) {
            setStatus({ type: 'error', message: err.message ?? 'Failed to update profile'});
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name ?? '');
        setEmail(user?.email ?? '');
        setStatus({ type: '', message: '' });
        setIsEditing(false);


    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-3xl font-bold">{t('settings')}</h2>
                <p className="text-slate-500 mt-1">{t('settingsDesc')}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('profileInformation')}</CardTitle>
                    <CardDescription>{t('profileDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {!isEditing && (
                        <div className="mb-6">
                            <Button type="button" onClick={() => { setIsEditing(true); setStatus({ type: '', message: ''}); }}>
                                {t('editProfile')}
                            </Button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.email ?? '')}`}
                                fallback={user?.name?.[0]}
                                className="h-20 w-20"
                            />
                            <div>
                                <p className="font-medium text-sm text-slate-700">{t('profilePicture')}</p>
                                <p className="text-xs text-slate-500 mt-1">{t('profilePictureDesc')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-slate-700">{t('fullName')}</label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('enterName')} disabled={!isEditing} required />
                            </div>
                            <div className="space-y-2">
                                 <label htmlFor="email" className="text-sm font-medium text-slate-700">{t('email')}</label>
                                 <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('enterEmail')} disabled={!isEditing} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">{t('role')}</label>
                                <Input value={user?.role ?? ''} disabled className="capitalize opacity-60" />
                            </div>
                        </div>

                        {status.message && (
                            <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {status.message}
                            </p>
                        )}

                        {isEditing && (
                            <div className="flex gap-3">
                                <Button type="submit" isLoading={isLoading}>{t('update')}</Button>
                                <Button type="button" variant="outline" onClick={handleCancel}>{t('cancel')}</Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('language')}</CardTitle>
                    <CardDescription>{t('languageDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LanguageSelector />
                </CardContent>
            </Card>
        </div>
    );
} ;