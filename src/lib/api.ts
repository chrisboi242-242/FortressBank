import { auth } from "./firebase";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Get current user's Firebase ID token to attach to every request
const getToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  return user.getIdToken();
};

// Generic fetch wrapper
const request = async (method: string, path: string, body?: any) => {
  const token = await getToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
};

// Public request (no token needed)
const publicRequest = async (method: string, path: string, body?: any) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
};

// ── User ─────────────────────────────────────────────────
export const apiRegisterUser = (body: {
  userId: string; firstName: string; lastName: string; email: string;
  phoneNumber: string; idNumber: string; faceSignature: string;
}) => request("POST", "/users/register", body);

export const apiGetMe = () => request("GET", "/users/me");

export const apiLookupAccount = (accountNumber: string) =>
  request("GET", `/users/lookup/${encodeURIComponent(accountNumber)}`);

// ── Transactions ──────────────────────────────────────────
export const apiCreateTransfer = (body: {
  recipientAccount: string; amount: number; currency: string; note: string;
}) => request("POST", "/transactions/transfer", body);

export const apiGetMyTransactions = () => request("GET", "/transactions/my");

// ── Messages ──────────────────────────────────────────────
export const apiGetMessages = () => publicRequest("GET", "/messages");

// ── Admin ─────────────────────────────────────────────────
export const apiGetAllUsers        = ()                                    => request("GET",   "/users");
export const apiUpdateUserStatus   = (userId: string, status: string)     => request("PATCH", `/users/${userId}/status`,   { status });
export const apiCreditBalance      = (userId: string, body: any)          => request("POST",  `/users/${userId}/credit`,   body);
export const apiGetAllTransactions = ()                                    => request("GET",   "/transactions/all");
export const apiUpdateTxStatus     = (txId: string, status: string)       => request("PATCH", `/transactions/${txId}/status`, { status });
export const apiPostMessage        = (message: string, type: string)      => request("POST",  "/messages",                 { message, type });
export const apiDeactivateMessage  = (id: string)                         => request("PATCH", `/messages/${id}/deactivate`);
