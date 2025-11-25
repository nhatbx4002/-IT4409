const FRONTEND_FALLBACK = "http://localhost:5173";

const normalizeBaseUrl = (url = FRONTEND_FALLBACK) => url.replace(/\/+$/, "");

export const getFrontendBaseUrl = () =>
  normalizeBaseUrl(process.env.FRONTEND_URL || FRONTEND_FALLBACK);

export const buildOAuthCallbackUrl = (params = {}) => {
  const callbackBase = `${getFrontendBaseUrl()}/auth/callback`;
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      searchParams.append(key, value);
    }
  });

  return `${callbackBase}?${searchParams.toString()}`;
};

export const redirectOAuthError = (res, message, state) => {
  const params = {
    error: "true",
    errorMessage: message,
  };

  if (state) {
    params.state = state;
  }

  return res.redirect(buildOAuthCallbackUrl(params));
};

