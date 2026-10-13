import { 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider, db } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType, scrubSecrets } from './errors';
import { User } from '../types';

export interface SessionInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerId: string;
  providers: string[];
  creationTime?: string;
  lastSignInTime?: string;
}

// Convert Firebase Auth error codes to user-friendly messages while protecting secrets
export function formatAuthError(error: any): string {
  if (!error) return 'An unknown authentication error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'The email address entered is not valid. Please check and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication is currently not enabled in Firebase Console. Please use "Continue with Google" or enable Email/Password provider in the Firebase project console.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please choose at least 6 characters.';
    case 'auth/user-disabled':
      return 'This student account has been disabled. Please contact campus admin.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'The browser blocked the sign-in popup. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Access to this account has been temporarily disabled. Please reset your password or try again later.';
    default:
      return scrubSecrets(error.message || 'Authentication failed. Please try again.');
  }
}

/**
 * Sync or initialize student profile in Firestore upon sign in / sign up
 */
export async function syncUserProfile(
  fbUser: FirebaseUser,
  fallbackDetails?: Partial<User>
): Promise<User> {
  const userDocRef = doc(db, 'users', fbUser.uid);
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const existing = snap.data() as User;
      // Update any updated photo or name
      const updates: Partial<User> = {};
      if (fbUser.displayName && fbUser.displayName !== existing.name) {
        updates.name = fbUser.displayName;
      }
      if (fbUser.photoURL && fbUser.photoURL !== existing.avatar) {
        updates.avatar = fbUser.photoURL;
      }
      if (Object.keys(updates).length > 0) {
        await updateDoc(userDocRef, updates);
        return { ...existing, ...updates };
      }
      return existing;
    } else {
      // First-time registration: Create student profile record
      const newProfile: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fallbackDetails?.name || 'Campus Student',
        email: fbUser.email || fallbackDetails?.email || '',
        avatar: fbUser.photoURL || fallbackDetails?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        university: fallbackDetails?.university || 'University of Nairobi',
        school: fallbackDetails?.school || 'Faculty of Science & Technology',
        course: fallbackDetails?.course || 'B.Sc. Computer Science',
        yearOfStudy: fallbackDetails?.yearOfStudy || 'Year 2',
        interests: fallbackDetails?.interests || ['Artificial Intelligence', 'Software Engineering', 'Study Circles'],
        skills: fallbackDetails?.skills || ['Python', 'Web Development', 'Problem Solving'],
        hobbies: fallbackDetails?.hobbies || ['Chess', 'Photography', 'Campus Events'],
        bio: fallbackDetails?.bio || `Verified student at ${fallbackDetails?.university || 'University of Nairobi'}. Passionate about academic collaboration.`,
        verified: true,
        status: 'online',
        visibility: 'public',
        allowDMs: true,
        showEmail: true,
        e2eeFingerprint: `SC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        blockedUserIds: [],
      };
      await setDoc(userDocRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${fbUser.uid}`);
  }
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<{ fbUser: FirebaseUser; profile: User }> {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const cred: UserCredential = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfile(cred.user);
    return { fbUser: cred.user, profile };
  } catch (error) {
    throw error;
  }
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  fullName: string,
  university: string,
  course?: string
): Promise<{ fbUser: FirebaseUser; profile: User }> {
  try {
    const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (fullName) {
      await updateProfile(cred.user, { displayName: fullName });
    }
    // Attempt sending verification email
    try {
      await sendEmailVerification(cred.user);
    } catch (e) {
      console.warn('Could not send verification email automatically:', e);
    }

    const profile = await syncUserProfile(cred.user, {
      name: fullName,
      email,
      university: university || 'University of Nairobi',
      course: course || 'Undergraduate Degree',
    });

    return { fbUser: cred.user, profile };
  } catch (error) {
    throw error;
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(
  email: string,
  pass: string
): Promise<{ fbUser: FirebaseUser; profile: User }> {
  try {
    const cred: UserCredential = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await syncUserProfile(cred.user);
    return { fbUser: cred.user, profile };
  } catch (error) {
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Resend email verification
 */
export async function resendVerification(): Promise<void> {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No user is currently logged in.');
  }
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Inspect active session details
 */
export function getSessionDetails(user: FirebaseUser | null): SessionInfo | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    providerId: user.providerId,
    providers: user.providerData?.map(p => p.providerId) || [],
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime,
  };
}
