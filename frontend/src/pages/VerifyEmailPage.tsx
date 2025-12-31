import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resendVerificationEmail } from '../lib/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  
  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Nếu có token trong URL, redirect đến backend để verify
    if (token && !success && !error) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      window.location.href = `${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
    }
  }, [token, success, error]);

  const handleResend = async () => {
    if (!email) {
      setResendMessage("Không tìm thấy email. Vui lòng đăng ký lại.");
      return;
    }

    setIsResending(true);
    setResendMessage(null);

    try {
      await resendVerificationEmail(email);
      setResendMessage("Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.");
    } catch (err) {
      setResendMessage(
        err instanceof Error ? err.message : "Không thể gửi email. Vui lòng thử lại sau."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {success ? (
          <>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Xác thực thành công!
              </h2>
              <p className="text-gray-600 mb-6">
                Email của bạn đã được xác thực. Bây giờ bạn có thể đăng nhập vào tài khoản.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#667eea] text-white py-2 px-4 rounded-lg hover:bg-[#5568d3] transition"
              >
                Đăng nhập ngay
              </button>
            </div>
          </>
        ) : error ? (
          <>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Xác thực thất bại
              </h2>
              <p className="text-gray-600 mb-6">
                {decodeURIComponent(error)}
              </p>
              {email && (
                <>
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full bg-[#667eea] text-white py-2 px-4 rounded-lg hover:bg-[#5568d3] transition disabled:opacity-50 mb-4"
                  >
                    {isResending ? 'Đang gửi...' : 'Gửi lại email xác thực'}
                  </button>
                  {resendMessage && (
                    <p className={`text-sm ${resendMessage.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                      {resendMessage}
                    </p>
                  )}
                </>
              )}
              <button
                onClick={() => navigate('/signup')}
                className="w-full mt-4 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
              >
                Đăng ký lại
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xác thực email...</p>
          </div>
        )}
      </div>
    </div>
  );
}

