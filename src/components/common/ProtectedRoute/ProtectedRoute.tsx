import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../services/firebase';
import { Loader2 } from 'lucide-react';
import logo from '../../../assets/icons/logo.svg';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #A9C7FF 0%, #8DF8E7 50%, #A9C7FF 100%)' }}>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'rgba(169, 199, 255, 0.4)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" style={{ backgroundColor: 'rgba(141, 248, 231, 0.4)' }}></div>
        <div className="text-center relative z-10">
          <img src={logo} alt="PGadmit" className="h-10 mx-auto mb-6" />
          <Loader2 className="w-10 h-10 text-primary-dark animate-spin mx-auto" />
          <p className="text-primary-darkest mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
