import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './core/services/auth';
import { RentalService } from './core/services/rental';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    @if (authService.user(); as user) {
      <div class="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <!-- Profile Header -->
        <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div class="relative group">
            <div class="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img [src]="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid" 
                 class="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover relative border-2 border-white/10"
                 alt="User Profile" referrerpolicy="no-referrer">
          </div>
          
          <div class="text-center md:text-left">
            <h1 class="text-3xl md:text-5xl font-bold mb-2">{{ user.displayName }}</h1>
            <p class="text-slate-400 flex items-center justify-center md:justify-start gap-2">
              <mat-icon class="scale-75">email</mat-icon>
              {{ user.email }}
            </p>
            <div class="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <div class="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <p class="text-xs text-slate-500">Member since</p>
                <p class="font-bold">{{ user.metadata.creationTime | date:'mediumDate' }}</p>
              </div>
              <div class="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <p class="text-xs text-slate-500">Total Rides</p>
                <p class="font-bold text-emerald-400">{{ rentalService.rentals().length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Rentals Section -->
        <div class="space-y-12">
          <div>
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <mat-icon class="text-emerald-400">electric_bolt</mat-icon>
              </div>
              <h2 class="text-2xl font-bold">Active Sessions</h2>
            </div>

            @if (activeRentals().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (item of activeRentals(); track item.id) {
                  <div class="glass-card p-6 border-emerald-500/30 bg-emerald-500/5 flex flex-col md:flex-row gap-6">
                    <div class="w-full md:w-32 h-32 bg-slate-900 rounded-2xl overflow-hidden shrink-0">
                      <mat-icon class="w-full h-full flex items-center justify-center text-4xl text-slate-700">directions_bike</mat-icon>
                    </div>
                    <div class="flex-grow space-y-2">
                      <div class="flex justify-between items-start">
                        <h3 class="text-xl font-bold">{{ item.bikeName }}</h3>
                        <span class="px-2 py-1 bg-emerald-500 text-white text-[10px] uppercase font-bold rounded">Active</span>
                      </div>
                      <p class="text-sm text-slate-400">Started: {{ (item.startTime?.toDate() || 0) | date:'medium' }}</p>
                      
                      <div class="pt-4 flex gap-4">
                        <button class="btn-primary py-2 px-4 text-xs" (click)="completeRide(item)">
                          Stop & Pay
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12 glass-card border-dashed">
                <p class="text-slate-500">No active rides at the moment.</p>
              </div>
            }
          </div>

          <div>
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <mat-icon class="text-blue-400">history</mat-icon>
              </div>
              <h2 class="text-2xl font-bold">Rental History</h2>
            </div>

            @if (completedRentals().length > 0) {
              <div class="overflow-x-auto glass-card">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-slate-500 text-sm border-b border-white/5 uppercase tracking-wider">
                      <th class="px-6 py-4 font-medium">Bike</th>
                      <th class="px-6 py-4 font-medium">Date</th>
                      <th class="px-6 py-4 font-medium">Duration</th>
                      <th class="px-6 py-4 font-medium">Amount</th>
                      <th class="px-6 py-4 font-medium text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    @for (item of completedRentals(); track item.id) {
                      <tr class="hover:bg-white/[0.02] transition-colors group">
                        <td class="px-6 py-4 font-bold text-white">{{ item.bikeName }}</td>
                        <td class="px-6 py-4 text-slate-400">{{ (item.startTime?.toDate() || 0) | date:'mediumDate' }}</td>
                        <td class="px-6 py-4 text-slate-400">
                          {{ calculateDuration(item) }}
                        </td>
                        <td class="px-6 py-4 font-mono text-emerald-400 font-bold">$ {{ item.totalPrice?.toFixed(2) }}</td>
                        <td class="px-6 py-4 text-right">
                          <button mat-icon-button class="text-slate-500 group-hover:text-white transition-colors">
                            <mat-icon>download</mat-icon>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="text-center py-12 glass-card border-dashed">
                <p class="text-slate-500">Your rental history will appear here.</p>
              </div>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-[80vh] flex flex-col items-center justify-center gap-8 px-6 text-center">
        <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center animate-bounce">
          <mat-icon class="text-6xl h-auto w-auto text-slate-500">lock</mat-icon>
        </div>
        <div class="max-w-md">
          <h2 class="text-3xl font-bold mb-4">Account Required</h2>
          <p class="text-slate-400 mb-8">Please sign in to view your profile, manage active rentals, and see your booking history.</p>
          <button class="btn-primary w-full py-4" (click)="authService.login()">
            Sign In with Google
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    th { @apply whitespace-nowrap; }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
  rentalService = inject(RentalService);

  activeRentals = computed(() => 
    this.rentalService.rentals().filter(r => r.status === 'active')
  );

  completedRentals = computed(() => 
    this.rentalService.rentals().filter(r => r.status !== 'active')
  );

  calculateDuration(item: any): string {
    if (!item.startTime || !item.endTime) return '0h';
    const start = item.startTime.toDate().getTime();
    const end = item.endTime.toDate().getTime();
    const diffMs = end - start;
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    return `${hours}h`;
  }

  async completeRide(item: any) {
    // For demo, we just calculate based on a fixed logic
    const start = item.startTime.toDate().getTime();
    const end = Date.now();
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    
    // Total price (we should ideally fetch the hourly rate from the bike collection)
    const totalPrice = hours * 15; // fallback or logic
    
    await this.rentalService.completeRental(item.id!, item.bikeId, totalPrice);
  }
}
