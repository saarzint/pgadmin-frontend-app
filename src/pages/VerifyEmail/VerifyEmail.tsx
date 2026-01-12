import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/supabase';
import { Mail, RefreshCw, Loader2, CheckCircle, LogOut } from 'lucide-react';
import logo from '../../assets/icons/logo.svg';

const VerifyEmail = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { user, logout, resendVerificationEmail, reloadUser } = useAuth();
  const navigate = useNavigate();

  // Check if email is verified every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await reloadUser();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, reloadUser]);

  // Redirect to dashboard if verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/dashboard');
    }
  }, [user?.emailVerified, navigate]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendSuccess(false);
    try {
      await resendVerificationEmail();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch {
      // Error handled by context
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      await reloadUser();
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #A9C7FF 0%, #8DF8E7 50%, #A9C7FF 100%)' }}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'rgba(169, 199, 255, 0.4)' }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" style={{ backgroundColor: 'rgba(141, 248, 231, 0.4)' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <img src={logo} alt="PGadmit Logo" className="h-10" />
          </div>
          <h1 className="text-3xl font-bold text-primary-darkest">Verify Your Email</h1>
          <p className="text-primary-dark/70 mt-2">One last step to get started</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/50 backdrop-blur-sm">
          <div className="text-center">
            {/* Email Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-gradient-blue to-gradient-cyan rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="w-10 h-10 text-primary-darkest" />
            </div>

            <h2 className="text-xl font-semibold text-primary-darkest mb-2">Check Your Inbox</h2>
            <p className="text-neutral-gray mb-2">
              We've sent a verification email to:
            </p>
            <p className="font-semibold text-primary-dark mb-4">
              {user?.email}
            </p>

            {/* Spam Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 font-medium mb-1">
                ⚠️ Check your Spam/Junk folder!
              </p>
              <p className="text-xs text-amber-700">
                The verification email often ends up in spam. Please check there if you don't see it in your inbox.
              </p>
            </div>

            <p className="text-sm text-neutral-gray mb-6">
              Click the link in the email to verify your account. 
              This page will automatically update once verified.
            </p>

            {/* Success Message */}
            {resendSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Verification email sent successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Check Verification Button */}
              <button
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full py-3 bg-primary-dark hover:bg-primary-darkest text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {isChecking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    I've Verified My Email
                  </>
                )}
              </button>

              {/* Resend Email Button */}
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-primary-darkest"
              >
                {isResending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Resend Verification Email
                  </>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full py-3 text-neutral-gray hover:text-primary-darkest transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Use a different account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-primary-darkest/50">
          © 2024 PGadmit. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
