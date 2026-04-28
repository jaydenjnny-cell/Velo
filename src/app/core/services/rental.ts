import { Injectable, signal, inject, effect, Injector } from '@angular/core';
import { db, auth } from '../firebase.config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { AuthService } from './auth';
import { handleFirestoreError, OperationType } from '../utils/error-handler';

export interface Rental {
  id?: string;
  bikeId: string;
  userId: string;
  bikeName: string;
  userName: string;
  startTime: any;
  endTime?: any;
  totalPrice?: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: any;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private authService = inject(AuthService);
  private rentalsSignal = signal<Rental[]>([]);
  readonly rentals = this.rentalsSignal.asReadonly();
  private unsubscribe: (() => void) | null = null;

  constructor(private injector: Injector) {
      effect(() => {
        const user = this.authService.user();
        this.manageSubscription(user?.uid);
      }, { injector: this.injector });
  }

  private manageSubscription(uid?: string) {
    if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
    }

    if (!uid) {
      this.rentalsSignal.set([]);
      return;
    }

    const rentalsRef = collection(db, 'rentals');
    const q = query(rentalsRef, where('userId', '==', uid));

    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const rentals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rental));
      this.rentalsSignal.set(rentals);
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'rentals');
    });
  }

  async bookBike(bikeId: string, bikeName: string, pricePerHour: number) {
    const user = this.authService.user();
    if (!user) throw new Error('Must be logged in to book');

    const rentalData: Omit<Rental, 'id'> = {
      bikeId,
      userId: user.uid,
      bikeName,
      userName: user.displayName || 'Anonymous',
      startTime: serverTimestamp(),
      status: 'active',
      createdAt: serverTimestamp()
    };

    try {
      const batch = writeBatch(db);
      const rentalRef = doc(collection(db, 'rentals'));
      const bikeRef = doc(db, 'bikes', bikeId);
      
      batch.set(rentalRef, rentalData);
      batch.update(bikeRef, { available: false });
      
      await batch.commit();
      return rentalRef;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'rentals');
      throw error;
    }
  }

  async completeRental(rentalId: string, bikeId: string, totalPrice: number) {
    const rentalRef = doc(db, 'rentals', rentalId);
    const bikeRef = doc(db, 'bikes', bikeId);
    try {
      const batch = writeBatch(db);
      batch.update(rentalRef, {
        status: 'completed',
        endTime: serverTimestamp(),
        totalPrice
      });
      batch.update(bikeRef, { available: true });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `rentals/${rentalId}`);
      throw error;
    }
  }
}
