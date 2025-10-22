import React, { useState } from 'react';
import Button from '../components/Button';
import { account } from '../lib/appwrite';
import { AppwriteException } from 'appwrite';

interface LoginPageProps {
    onLogin: (appwriteUserId: string) => void;
    onNavigate: (page: 'signup' | 'home') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Fix: Use createEmailPasswordSession for email/password login
            await account.createEmailPasswordSession(email, password);
            const appwriteUser = await account.get();
            onLogin(appwriteUser.$id);
        } catch (err) {
            console.error('Login failed:', err);
            if (err instanceof AppwriteException) {
              setError(err.message);
            } else {
              setError('An unexpected error occurred during login.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white py-20 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-light-lavender/50 p-8 rounded-xl shadow-2xl border border-soft-gray">
                    <h1 className="font-unica-one text-4xl text-center font-bold text-primary-text mb-2">Welcome Back!</h1>
                    <p className="text-center text-secondary-text mb-8">Log in to access your dashboard.</p>
                    
                    {error && (
                        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6 text-center">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-secondary-text mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" 
                                placeholder="you@example.com" 
                                required 
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-secondary-text mb-2">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-input-bg border border-soft-gray rounded-lg focus:ring-accent-primary focus:border-accent-primary text-primary-text" 
                                placeholder="••••••••" 
                                required 
                                disabled={loading}
                            />
                        </div>
                        <div className="text-center">
                            {/* Fix: Added disabled prop */}
                            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                                {loading ? 'Logging In...' : 'Log In'}
                            </Button>
                        </div>
                    </form>
                    <p className="text-center text-secondary-text mt-6">
                        Don't have an account?{' '}
                        <button onClick={() => onNavigate('signup')} className="font-bold text-accent-primary hover:text-accent-hover" disabled={loading}>
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;