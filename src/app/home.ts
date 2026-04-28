import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BikeService } from './core/services/bike';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=2000&auto=format&fit=crop" 
             class="w-full h-full object-cover opacity-40 scale-105"
             alt="Hero background">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950"></div>
      </div>

      <div class="relative z-10 text-center max-w-4xl px-6">
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Ride the <span class="text-emerald-400">Future</span> of Urban Mobility
        </h1>
        <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Premium bicycle rentals for explorers, commuters, and weekend warriors. Book your dream ride in seconds.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <button class="btn-primary text-lg px-8 py-4" (click)="scrollToGrid()">
            View Collection
            <mat-icon>expand_more</mat-icon>
          </button>
          <button class="btn-secondary text-lg px-8 py-4">
            How it works
          </button>
        </div>
      </div>
    </section>

    <!-- Bike Catalog -->
    <div id="bike-grid" class="max-w-7xl mx-auto px-6 py-20">
      <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h2 class="text-3xl font-bold mb-2">Our Fleet</h2>
          <p class="text-slate-400">Filter by category to find your perfect match</p>
        </div>

        <div class="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto max-w-full">
          @for (type of bikeService.bikeTypes; track type) {
            <button 
              (click)="bikeService.setFilter(type)"
              [class]="bikeService.currentFilter() === type ? 
                'px-6 py-2 bg-emerald-500 text-white font-semibold rounded-xl transition-all' : 
                'px-6 py-2 text-slate-400 hover:text-white transition-all whitespace-nowrap'"
            >
              {{ type | titlecase }}
            </button>
          }
        </div>
      </div>

      @if (bikeService.isLoading()) {
        <div class="flex flex-col items-center justify-center py-20 gap-4">
          <div class="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p class="text-slate-400 animate-pulse">Loading fleet...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (bike of bikeService.bikes(); track bike.id) {
            <div class="glass-card group hover:scale-[1.02] transition-all duration-300 flex flex-col h-full overflow-hidden" 
                 [routerLink]="['/bike', bike.id]">
              <div class="relative h-64 overflow-hidden">
                <img [src]="bike.imageUrl" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     alt="{{ bike.name }}">
                <div class="absolute top-4 left-4 flex gap-2">
                  <span class="px-3 py-1 bg-black/60 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {{ bike.type }}
                  </span>
                  @if (!bike.available) {
                    <span class="px-3 py-1 bg-red-500/80 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Rented
                    </span>
                  }
                </div>
                <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div class="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold shadow-lg">
                  $ {{ bike.pricePerHour }}/hr
                </div>
              </div>

              <div class="p-6 flex-grow flex flex-col">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-bold leading-tight">{{ bike.name }}</h3>
                  <div class="flex items-center gap-1 text-yellow-400">
                    <mat-icon class="scale-75 translate-y-[-2px]">star</mat-icon>
                    <span class="text-sm font-medium">{{ bike.rating }}</span>
                  </div>
                </div>
                <p class="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">{{ bike.description }}</p>
                
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div class="flex gap-4 text-xs text-slate-500 font-mono">
                    <span class="flex items-center gap-1">
                      <mat-icon class="scale-75">monitor_weight</mat-icon>
                      {{ bike.specs.weight }}
                    </span>
                    <span class="flex items-center gap-1">
                      <mat-icon class="scale-75">settings</mat-icon>
                      {{ bike.specs.gears }}
                    </span>
                  </div>
                  <mat-icon class="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</mat-icon>
                </div>
              </div>
            </div>
          }
        </div>

        @if (bikeService.bikes().length === 0) {
          <div class="text-center py-20 glass-card">
            <mat-icon class="text-6xl h-auto w-auto text-slate-700 mb-4 uppercase">search_off</mat-icon>
            <h3 class="text-2xl font-bold">No bikes found</h3>
            <p class="text-slate-400">Try adjusting your filters or search keywords</p>
          </div>
        }
      }
    </div>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div class="p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 transition-colors">
          <div class="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-blue-400 text-3xl h-auto w-auto">verified</mat-icon>
          </div>
          <h4 class="text-xl font-bold mb-4">Premium Quality</h4>
          <p class="text-slate-400">Every bike is hand-inspected and maintained by certified professionals daily.</p>
        </div>
        <div class="p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 transition-colors">
          <div class="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-emerald-400 text-3xl h-auto w-auto">bolt</mat-icon>
          </div>
          <h4 class="text-xl font-bold mb-4">Instant Booking</h4>
          <p class="text-slate-400">Find, book, and unlock your ride in under 60 seconds with our seamless app.</p>
        </div>
        <div class="p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 transition-colors">
          <div class="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-purple-400 text-3xl h-auto w-auto">support_agent</mat-icon>
          </div>
          <h4 class="text-xl font-bold mb-4">24/7 Support</h4>
          <p class="text-slate-400">Our roadside assistance team is always ready to help you wherever you are.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .animate-spin { border-top-color: transparent !important; }
  `]
})
export class HomeComponent {
  bikeService = inject(BikeService);

  scrollToGrid() {
    document.getElementById('bike-grid')?.scrollIntoView({ behavior: 'smooth' });
  }
}
