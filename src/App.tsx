import { useState, useEffect } from "react";
import { applicants, type Applicant } from "./data/applicants";
import { getSession, clearSession, initials, type UserAccount } from "./auth/store";
import ApplicantList from "./components/ApplicantList";
import ApplicantDetail from "./components/ApplicantDetail";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";

type AuthPage = "login" | "signup" | "forgot";

export default function App() {
  const [user, setUser] = useState<UserAccount | null>(() => getSession());
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
  }, []);

  const handleLogin = () => {
    const session = getSession();
    setUser(session);
  };

  const handleSignOut = () => {
    clearSession();
    setUser(null);
    setSelected(null);
    setAuthPage("login");
  };

  /* ── Auth screens ────────────────────────────────────────────────── */
  if (!user) {
    if (authPage === "signup")
      return <SignUp onSignUp={handleLogin} onGoLogin={() => setAuthPage("login")} />;
    if (authPage === "forgot")
      return <ForgotPassword onBack={() => setAuthPage("login")} />;
    return (
      <Login
        onLogin={handleLogin}
        onGoSignUp={() => setAuthPage("signup")}
        onForgotPassword={() => setAuthPage("forgot")}
      />
    );
  }

  const userInitials = initials(user.name);

  /* ── Main app ────────────────────────────────────────────────────── */
  return (
    <div className="min-h-full flex flex-col bg-[#f4f6fa]">
      <header className="bg-[#003DA5] text-white shadow-lg">
        <div className="max-w-screen-xl mx-auto px-6 flex items-stretch gap-0">
          <div className="flex items-center gap-4 py-4 pr-8 border-r border-white/20">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-[#003DA5] font-bold text-sm">DAAD</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-200 font-medium">Deutscher Akademischer Austauschdienst</div>
              <div className="text-white font-semibold text-sm">German Academic Exchange Service</div>
            </div>
          </div>
          <div className="flex items-center px-8 py-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-200 font-medium">AI Document Validation</div>
              <div className="font-semibold text-base">Helmut-Schmidt-Programme — Selection Review</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 py-4 relative">
            <div className="hidden sm:block bg-white/10 rounded px-3 py-1.5 text-xs text-blue-100">
              Kommission: Social Policy &amp; Social Security Studies
            </div>

            {/* Profile button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm font-bold tracking-wide transition-colors border-2 border-white/30"
              title={user.name}
            >
              {userInitials}
            </button>

            {/* Profile dropdown */}
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#003DA5] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{user.name}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      {user.role && <div className="text-[10px] text-[#003DA5] font-medium mt-0.5">{user.role}</div>}
                    </div>
                  </div>
                </div>
                {user.institution && (
                  <div className="px-5 py-2.5 border-b border-gray-100">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Institution</div>
                    <div className="text-xs text-gray-700 font-medium">{user.institution}</div>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto w-full flex-1 px-6 py-6">
        {selected ? (
          <ApplicantDetail applicant={selected} onBack={() => setSelected(null)} senderName={user.name} senderEmail={user.email} />
        ) : (
          <ApplicantList applicants={applicants} onSelect={setSelected} />
        )}
      </div>
    </div>
  );
}
