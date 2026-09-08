export interface UserAccount {
  name: string;
  email: string;
  password: string;
  institution: string;
  role: string;
  createdAt: string;
}

const KEY = "daad_accounts";
const SESSION_KEY = "daad_session";

export function getAccounts(): UserAccount[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveAccount(user: UserAccount): void {
  const accounts = getAccounts();
  const exists = accounts.find((a) => a.email.toLowerCase() === user.email.toLowerCase());
  if (exists) throw new Error("An account with this email already exists.");
  accounts.push(user);
  localStorage.setItem(KEY, JSON.stringify(accounts));
}

export function login(email: string, password: string): UserAccount {
  const accounts = getAccounts();
  const user = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("No account found with this email address.");
  if (user.password !== password) throw new Error("Incorrect password. Please try again.");
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function getSession(): UserAccount | null {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function resetPassword(email: string, newPassword: string): void {
  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => a.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) throw new Error("No account found with this email address.");
  accounts[idx].password = newPassword;
  localStorage.setItem(KEY, JSON.stringify(accounts));
  const session = getSession();
  if (session?.email.toLowerCase() === email.toLowerCase()) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(accounts[idx]));
  }
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 3);
}
