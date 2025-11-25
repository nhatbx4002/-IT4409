export const requestLogger = (enabled = process.env.NODE_ENV !== "production") => {
  if (!enabled) {
    return (_req, _res, next) => next();
  }

  return (req, _res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", JSON.stringify(req.body, null, 2));
    next();
  };
};
