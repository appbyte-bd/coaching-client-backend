// helpers/response.js
export const ok = (res, data = {}) => res.json({ success: true, data });
export const fail = (res, code, msg) => res.status(code).json({ success: false, error: msg });