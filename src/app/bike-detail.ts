import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BikeService } from './core/services/bike';
import { RentalService } from './core/services/rental';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-bike-detail',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink, MatSnackBarModule],
  template: `
    @if (bike(); as b) {
      <div class="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-500">
        <div class="flex items-center gap-4 mb-8">
          <button mat-icon-button routerLink="/" class="text-slate-400 hover:text-white">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <span class="text-slate-400">Back to all bikes</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <!-- Image Section -->
          <div class="lg:col-span-7">
            <div class="glass-card overflow-hidden sticky top-32 group">
              <img [src]="b.imageUrl" class="w-full h-auto max-h-[600px] object-cover" alt="{{ b.name }}">
              <div class="absolute top-4 right-4">
                <input type="file" (change)="uploadImage($event)" accept="image/*" class="hidden" #fileInput>
                <button 
                  mat-raised-button 
                  (click)="fileInput.click()" 
                  [disabled]="isUploading()" 
                  class="bg-white/10 text-white backdrop-blur-sm"
                >
                  <mat-icon>{{ isUploading() ? 'sync' : 'camera_alt' }}</mat-icon>
                  {{ isUploading() ? 'Uploading...' : 'Update Image' }}
                </button>
              </div>
              <div class="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </div>
          </div>

          <!-- Content Section -->
          <div class="lg:col-span-5 space-y-10">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {{ b.type }}
                </span>
                @if (b.available) {
                  <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                    Available Now
                  </span>
                } @else {
                  <span class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                    Currently Rented
                  </span>
                }
              </div>
              <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ b.name }}</h1>
              <div class="flex items-center gap-4 text-slate-400">
                <div class="flex items-center gap-1 text-yellow-500">
                  <mat-icon>star</mat-icon>
                  <span class="font-bold">{{ b.rating }}</span>
                </div>
                <span>•</span>
                <span>{{ b.reviewsCount }} verified reviews</span>
              </div>
            </div>

            <div class="glass-card p-8 border-emerald-500/20 bg-emerald-500/5">
              <div class="flex justify-between items-end mb-8">
                <div>
                  <p class="text-slate-400 text-sm mb-1 uppercase tracking-widest font-semibold italic">Starting from</p>
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-bold text-white">$ {{ b.pricePerHour }}</span>
                    <span class="text-slate-400">/ hour</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-emerald-400 font-bold mb-1">Free delivery</p>
                  <p class="text-xs text-slate-500">Insurance included</p>
                </div>
              </div>

              @if (authService.user()) {
                <button 
                  class="btn-primary w-full py-4 text-lg shadow-xl shadow-emerald-500/10" 
                  [disabled]="isBooking()"
                  (click)="bookNow(b)"
                >
                  <mat-icon>{{ isBooking() ? 'sync' : 'flash_on' }}</mat-icon>
                  {{ isBooking() ? 'Processing...' : 'Book This Ride' }}
                </button>
              } @else {
                <button class="btn-secondary w-full py-4 text-lg" (click)="authService.login()">
                  <mat-icon>login</mat-icon>
                  Sign in to book
                </button>
              }
              
              <p class="text-center text-xs text-slate-500 mt-4">
                By booking, you agree to our Terms and safety guidelines.
              </p>
            </div>

            <div class="space-y-6">
              <h3 class="text-xl font-bold border-b border-white/10 pb-2">Technical Specs</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p class="text-xs text-slate-500 mb-1">Weight</p>
                  <p class="font-semibold">{{ b.specs.weight }}</p>
                </div>
                <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p class="text-xs text-slate-500 mb-1">Gears</p>
                  <p class="font-semibold">{{ b.specs.gears }}</p>
                </div>
                <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p class="text-xs text-slate-500 mb-1">Frame Type</p>
                  <p class="font-semibold">{{ b.specs.frame }}</p>
                </div>
                @if (b.specs.battery) {
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p class="text-xs text-slate-500 mb-1">Battery</p>
                    <p class="font-semibold">{{ b.specs.battery }}</p>
                  </div>
                }
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-xl font-bold border-b border-white/10 pb-2">Overview</h3>
              <p class="text-slate-400 leading-relaxed">
                {{ b.description }}
                Experience uncompromised performance with our {{ b.name }}. Whether you're navigating urban jungles or tackling 
                mountain peaks, this {{ b.type }} bike is engineered for comfort and maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div class="w-16 h-16 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin"></div>
        <p class="text-slate-400 italic">Locating bike records...</p>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .animate-spin { border-top-color: transparent !important; }
  `]
})
export class BikeDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  bikeService = inject(BikeService);
  rentalService = inject(RentalService);
  authService = inject(AuthService);

  isBooking = signal(false);
  isUploading = signal(false);

  bike = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.bikeService.getBikeById(id) : null;
  });

  async uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file || !this.bike()) return;
    
    this.isUploading.set(true);
    try {
      const url = await this.bikeService.uploadBikeImage(this.bike()!.id, file);
      await this.bikeService.updateBikeImageUrl(this.bike()!.id, url);
      this.snackBar.open('Image uploaded successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error(error);
      this.snackBar.open('Failed to upload image.', 'Close', { duration: 3000 });
    } finally {
      this.isUploading.set(false);
    }
  }

  async bookNow(bike: any) {
    this.isBooking.set(true);
    try {
      await this.rentalService.bookBike(bike.id, bike.name, bike.pricePerHour);
      this.snackBar.open('Ride booked successfully!', 'View', {
        duration: 5000,
        panelClass: ['bg-emerald-500', 'text-white']
      }).onAction().subscribe(() => {
        this.router.navigate(['/profile']);
      });
      this.router.navigate(['/profile']);
    } catch (error) {
      console.error('Booking failed', error);
      this.snackBar.open('Failed to book. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.isBooking.set(false);
    }
  }
}
