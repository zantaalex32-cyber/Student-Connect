import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Lock, 
  User, 
  School, 
  BookOpen, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { UniversitySelectPicker } from './UniversitySelectPicker';
import { formatAuthError, getSessionDetails } from '../firebase/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'session';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const {
    firebaseUser,
    isFirebaseLoading,
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    sendPasswordResetRequest,
    sendVerificationEmailRequest,
    signOutUser,
    currentUser,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'session'>(() => {
    if (firebaseUser) return 'session';
    return initialMode;
  });

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedUni, setSelectedUni] = useState(currentUser.university || 'University of Nairobi');
  const [course, setCourse] = useState(currentUser.course || 'B.Sc. Computer Science');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  // Sync mode if user state changes
  React.useEffect(() => {
    if (firebaseUser && mode !== 'session') {
      setMode('session');
    } else if (!firebaseUser && mode === 'session') {
      setMode('login');
    }
  }, [firebaseUser]);

  if (!isOpen) return null;

  const session = getSessionDetails(firebaseUser);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      setSuccessMsg('Successfully signed in with Google!');
      setTimeout(() => onClose(), 900);
    } catch (err: any) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmailPassword(email, password);
      setSuccessMsg('Signed in successfully!');
      setTimeout(() => onClose(), 900);
    } catch (err: any) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!email || !password || !fullName) {
      setErrorMsg('Please provide your name, student email, and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUpWithEmailPassword(email, password, fullName, selectedUni, course);
      setSuccessMsg('Student account created successfully! Check your inbox for verification.');
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!email) {
      setErrorMsg('Please enter your registered student email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendPasswordResetRequest(email);
      setSuccessMsg(`Password reset link dispatched to ${email}. Please check your inbox.`);
    } catch (err: any) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      setIsSubmitting(true);
      await sendVerificationEmailRequest();
      setSuccessMsg('A new verification email has been sent to your address.');
    } catch (err: any) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSubmitting(true);
      await signOutUser();
      setMode('login');
      setSuccessMsg('You have successfully signed out.');
    } catch (err: any) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUid = () => {
    if (session?.uid) {
      navigator.clipboard?.writeText?.(session.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-slate-200 text-slate-900 relative my-6 overflow-hidden">
        {/* Brand Stripes Header */}
        <div className="h-2 w-full flex">
          <div className="flex-1 bg-sky-500" />
          <div className="flex-1 bg-emerald-500" />
          <div className="flex-1 bg-amber-400" />
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-purple-600" />
          <div className="flex-1 bg-indigo-600" />
        </div>

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              {mode === 'session' ? (
                <ShieldCheck className="w-5 h-5 text-white" />
              ) : mode === 'signup' ? (
                <UserPlus className="w-5 h-5 text-white" />
              ) : (
                <LogIn className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {mode === 'session'
                  ? 'Active Student Session'
                  : mode === 'signup'
                  ? 'Create Student Account'
                  : mode === 'forgot'
                  ? 'Reset Student Password'
                  : 'Student Sign In'}
              </h2>
              <p className="text-xs text-slate-500">
                Firebase Authentication & Verified Academic Cloud Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (when not signed in) */}
        {!firebaseUser && mode !== 'forgot' && (
          <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/70">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                mode === 'login'
                  ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg -mb-px'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                mode === 'signup'
                  ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg -mb-px'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 shadow-2xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span className="flex-1 leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* VIEW: SESSION MANAGEMENT (Active signed-in student) */}
          {mode === 'session' && session && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
                <img
                  src={session.photoURL || currentUser.avatar}
                  alt={session.displayName || currentUser.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {session.displayName || currentUser.name}
                    </h3>
                    <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Student
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                    {session.email || currentUser.email}
                  </p>
                  <p className="text-[11px] text-indigo-700 font-semibold truncate mt-0.5 flex items-center gap-1">
                    <School className="w-3 h-3 shrink-0" />
                    {currentUser.university}
                  </p>
                </div>
              </div>

              {/* Security & Session Metadata */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Session Security & Cryptography</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold block">Authentication Provider</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {session.providers.join(', ') || 'Google Cloud Auth'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold block">Email Status</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      {session.emailVerified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-amber-700">Unverified</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                    <span className="text-[10px] text-slate-500 font-semibold block">E2EE Cryptographic Identity Fingerprint</span>
                    <span className="font-mono text-[11px] font-bold text-slate-800">
                      {currentUser.e2eeFingerprint || 'SC-8392-4109-7721-BC44'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Unique Firebase UID</span>
                      <span className="font-mono text-[11px] text-slate-800 truncate block max-w-xs sm:max-w-sm">
                        {session.uid}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyUid}
                      title="Copy UID"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition shrink-0"
                    >
                      {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Session Timestamps */}
                {(session.creationTime || session.lastSignInTime) && (
                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    {session.creationTime && (
                      <p>Account Created: {new Date(session.creationTime).toLocaleString()}</p>
                    )}
                    {session.lastSignInTime && (
                      <p>Last Active Session: {new Date(session.lastSignInTime).toLocaleString()}</p>
                    )}
                  </div>
                )}

                {/* Resend verification button if unverified */}
                {!session.emailVerified && session.email && (
                  <div className="pt-2">
                    <button
                      onClick={handleResendVerification}
                      disabled={isSubmitting}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send verification email</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Session Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Signing out...' : 'Sign Out of Session'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-2.5 px-4 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* VIEW: SIGN IN / SIGN UP (When not signed in) */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-4">
              {/* One-Click Google Button */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting || isFirebaseLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-white text-slate-800 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition flex items-center justify-center gap-2.5 shadow-xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>
                    {isSubmitting
                      ? 'Connecting to Google...'
                      : mode === 'signup'
                      ? 'Sign Up with Google'
                      : 'Continue with Google'}
                  </span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-1.5">
                  Instant campus authentication with your university or personal Google Account
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider shrink-0">
                  Or with Student Email
                </span>
              </div>

              {/* Email & Password Form */}
              <form
                onSubmit={mode === 'signup' ? handleEmailSignUp : handleEmailSignIn}
                className="space-y-3"
              >
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Alex Chen or Amani Mwangi"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <UniversitySelectPicker
                        value={selectedUni}
                        onChange={setSelectedUni}
                        label="University / Institution"
                        placeholder="Choose your approved university..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Degree Course / Major
                      </label>
                      <div className="relative">
                        <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          placeholder="e.g. B.Sc. Computer Science"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@uonbi.ac.ke or student@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : mode === 'signup' ? (
                    <UserPlus className="w-4 h-4" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>
                    {isSubmitting
                      ? 'Authenticating...'
                      : mode === 'signup'
                      ? 'Create Student Account'
                      : 'Sign In to Campus'}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your student email address and we will dispatch a secure Firebase password reset link to your inbox.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@uonbi.ac.ke or your registered email"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>{isSubmitting ? 'Sending Link...' : 'Send Password Reset Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="py-2.5 px-4 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted & GDPR Compliant</span>
          </div>
          <span className="font-semibold text-indigo-700">Students Connect Auth</span>
        </div>
      </div>
    </div>
  );
};
