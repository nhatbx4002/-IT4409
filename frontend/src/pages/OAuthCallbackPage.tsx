import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthSession } from '@/lib/auth';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const decodeRedirectState = (stateParam: string | null): string | null => {
  if (!stateParam || typeof window === 'undefined') {
    return null;
  }

  try {
    const decoded = JSON.parse(window.atob(stateParam));
    if (decoded && typeof decoded.redirectTo === 'string' && decoded.redirectTo.startsWith('/')) {
      return decoded.redirectTo;
    }
  } catch (error) {
    console.error('Invalid OAuth state payload', error);
  }

  return null;
};

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const stateParam = searchParams.get('state');
    const decodedRedirect = decodeRedirectState(stateParam);
    setRedirectPath(decodedRedirect);

    const processCallback = () => {
      try {
        const accessToken = searchParams.get('accessToken') || searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const fullName = searchParams.get('fullName') || searchParams.get('name');
        const error = searchParams.get('error');
        const errorMsg = searchParams.get('errorMessage') || searchParams.get('message');

        if (error || errorMsg) {
          setStatus('error');
          setErrorMessage(errorMsg || error || 'OAuth authentication failed');
          return;
        }

        if (!accessToken || !userId || !email || !fullName) {
          setStatus('error');
          setErrorMessage('Missing authentication data. Please try again.');
          return;
        }

        setAuthSession(
          {
            accessToken,
            refreshToken: refreshToken ?? undefined,
          },
          {
            id: parseInt(userId),
            name: fullName,
            email,
          }
        );

        setStatus('success');
        
        setTimeout(() => {
          navigate(decodedRedirect || '/', { replace: true });
        }, 1500);
      } catch (error) {
        setStatus('error');
        setErrorMessage(
          error instanceof Error 
            ? error.message 
            : 'OAuth authentication failed. Please try again.'
        );
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-gray-50 to-gray-100">
      <div
        className="relative z-10 w-full max-w-md mx-auto px-6 py-12"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <h2
              style={{
                fontFamily: 'Playfair Display',
                fontSize: '24px',
                fontWeight: 700,
                color: '#111111',
                marginBottom: '8px',
              }}
            >
              Đang xác thực...
            </h2>
            <p
              style={{
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Vui lòng chờ trong khi chúng tôi đăng nhập cho bạn
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2
              style={{
                fontFamily: 'Playfair Display',
                fontSize: '24px',
                fontWeight: 700,
                color: '#111111',
                marginBottom: '8px',
              }}
            >
              Thành công!
            </h2>
            <p
              style={{
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              Đang chuyển hướng về trang chủ...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2
              style={{
                fontFamily: 'Playfair Display',
                fontSize: '24px',
                fontWeight: 700,
                color: '#111111',
                marginBottom: '8px',
              }}
            >
              Xác thực thất bại
            </h2>
            <p
              style={{
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#DC2626',
                marginBottom: '16px',
              }}
            >
              {errorMessage}
            </p>
            <button
              onClick={() => navigate(redirectPath || '/login')}
              className="px-6 py-2 rounded-lg transition-all"
              style={{
                background: '#D4AF37',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1A1A1A',
              }}
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
