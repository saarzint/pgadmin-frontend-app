import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/firebase';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import logo from '../../assets/icons/logo.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-primary-darkest">Reset Password</h1>
          <p className="text-primary-dark/70 mt-2">
            {isEmailSent ? 'Check your email' : "Enter your email to reset your password"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/50 backdrop-blur-sm">
          {isEmailSent ? (
            // Success State
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-dark" />
              </div>
              <h2 className="text-xl font-semibold text-primary-darkest mb-2">Email Sent!</h2>
              <p className="text-neutral-gray mb-6">
                We've sent a password reset link to <strong className="text-primary-darkest">{email}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Check your Spam/Junk folder!</strong> The email often ends up there.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium hover:bg-gray-100 transition-all text-primary-darkest"
                >
                  Try Another Email
                </button>
                <Link
                  to="/login"
                  className="w-full py-3 bg-primary-dark hover:bg-primary-darkest text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            // Form State
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-2">×</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-primary-darkest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all text-primary-darkest placeholder:text-neutral-gray"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary-dark hover:bg-primary-darkest text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 mt-6 text-neutral-gray hover:text-primary-darkest transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-primary-darkest/50">
          © 2024 PGadmit. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
