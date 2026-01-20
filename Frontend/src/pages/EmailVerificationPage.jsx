import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EmailVerificationPage = () => {
    const { user, emailVerified, sendVerificationEmail, refreshProfile } = useAuth();
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (emailVerified) {
            navigate('/visa-requirements-lookup');
        }
    }, [emailVerified, navigate]);

    // Simple polling to check if email is verified
    useEffect(() => {
        const interval = setInterval(() => {
            refreshProfile();
        }, 5000);
        return () => clearInterval(interval);
    }, [refreshProfile]);

    const handleResend = async () => {
        if (cooldown > 0) return;
        
        setSending(true);
        setMessage(null);
        try {
            await sendVerificationEmail();
            setMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
            setCooldown(60); // 1 minute cooldown
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to send verification email.' });
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-auto w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                        <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Verify your email</h2>
                    <p className="text-sm text-gray-600">
                        To access all features like visa lookups, trip planning, and embassy finder, you need to verify your email address.
                    </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                We've sent a verification link to <strong>{user?.email}</strong>. Please check your email and click the link to continue.
                            </p>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleResend}
                        disabled={sending || cooldown > 0}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${sending || cooldown > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                    >
                        {sending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
                    </button>
                    
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        I've verified my email
                    </button>
                </div>
                
                <div className="text-center">
                    <button
                        onClick={() => navigate('/user-login')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
