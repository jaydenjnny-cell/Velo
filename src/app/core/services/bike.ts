import { Injectable, signal, computed, inject } from '@angular/core';
import { Bike, MOCK_BIKES } from '../models/bike';
import { db } from '../firebase.config';
import { handleFirestoreError, OperationType } from '../utils/error-handler';
import { collection, onSnapshot, query, getDocs, writeBatch, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  private bikesSignal = signal<Bike[]>([]);
  private filterSignal = signal<string>('all');
  private loadingSignal = signal<boolean>(true);
  private storage = getStorage();

  readonly bikes = computed(() => {
    const filter = this.filterSignal();
    const bikes = this.bikesSignal();
    if (filter === 'all') return bikes;
    return bikes.filter(b => b.type === filter);
  });

  readonly bikeTypes = ['all', 'road', 'mountain', 'electric', 'hybrid'];
  readonly currentFilter = this.filterSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();

  constructor() {
    this.listenToBikes();
  }

  private listenToBikes() {
    // Only fetch/seed on the client
    if (typeof window === 'undefined') return;

    const bikesRef = collection(db, 'bikes');
    onSnapshot(bikesRef, (snapshot) => {
      const bikes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bike));
      this.bikesSignal.set(bikes);
      this.loadingSignal.set(false);
      
      // If no bikes found, seed them once for demo purposes
      if (bikes.length === 0) {
        this.seedBikes();
      }
    }, (error) => {
      console.error('Error fetching bikes:', error);
      this.loadingSignal.set(false);
    });
  }

  async seedBikes() {
    const batch = writeBatch(db);
    MOCK_BIKES.forEach(bike => {
      const bikeRef = doc(collection(db, 'bikes'), bike.id);
      batch.set(bikeRef, bike);
    });
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'bikes');
    }
  }

  setFilter(type: string) {
    this.filterSignal.set(type);
  }

  getBikeById(id: string) {
    return this.bikesSignal().find(b => b.id === id);
  }

  async uploadBikeImage(bikeId: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, `bikes/${bikeId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async updateBikeImageUrl(bikeId: string, url: string) {
    const bikeRef = doc(db, 'bikes', bikeId);
    try {
      await updateDoc(bikeRef, { imageUrl: url });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bikes/${bikeId}`);
      throw error;
    }
  }
}
