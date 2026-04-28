import { Injectable, signal, inject } from '@angular/core';
import { auth, db } from '../firebase.config';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/error-handler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();
  readonly loading = signal(true);

  constructor() {
    if (typeof window === 'undefined') return;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.syncUserProfile(user);
        this.userSignal.set(user);
      } else {
        this.userSignal.set(null);
      }
      this.loading.set(false);
    });
  }

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await this.syncUserProfile(result.user);
      return result.user;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async logout() {
    await signOut(auth);
  }

  private async syncUserProfile(user: User) {
    const userRef = doc(db, 'users', user.uid);
    try {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  }
}
