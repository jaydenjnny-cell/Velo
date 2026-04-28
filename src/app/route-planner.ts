import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-planner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-12">
      <h1 class="text-3xl font-bold mb-8">Bicycle Route Planner</h1>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Input section -->
        <div class="glass-card p-6 space-y-6">
          <div class="space-y-4">
            <label class="block text-sm font-medium text-slate-400">Starting Point</label>
            <input type="text" [(ngModel)]="start" placeholder="Enter starting address" class="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 transition-colors">
          </div>
          
          <div class="space-y-4">
            <label class="block text-sm font-medium text-slate-400">Destination</label>
            <input type="text" [(ngModel)]="end" placeholder="Enter destination" class="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 transition-colors">
          </div>
          <div class="space-y-4">
            <label class="block text-sm font-medium text-slate-400">Max Distance (km)</label>
            <input type="number" [(ngModel)]="distance" class="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 transition-colors">
          </div>

          <div class="space-y-4">
            <label class="block text-sm font-medium text-slate-400">Max Elevation Gain (m)</label>
            <input type="number" [(ngModel)]="elevationGain" class="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 transition-colors">
          </div>

          <div class="space-y-4">
            <label class="block text-sm font-medium text-slate-400">Preferred Terrain</label>
            <select [(ngModel)]="terrain" class="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 transition-colors">
              <option value="paved">Paved</option>
              <option value="trails">Trails</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          
          <button (click)="planRoute()" class="btn-primary w-full">
            <mat-icon>directions_bike</mat-icon>
            Plan Route
          </button>
        </div>

        <!-- Map and info section -->
        <div class="lg:col-span-2 glass-card p-6 min-h-[400px]">
          <div class="w-full h-full bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center text-slate-500">
            <!-- Integration Point: Google Maps API or similar -->
            <p>Map View (API Integration Placeholder)</p>
          </div>
        </div>

      </div>
    </div>
  `
})
export class RoutePlannerComponent {
  start = '';
  end = '';
  distance = 10;
  elevationGain = 0;
  terrain = 'paved';

  planRoute() {
    console.log('Planning route', { 
      start: this.start, 
      end: this.end, 
      distance: this.distance, 
      elevationGain: this.elevationGain,
      terrain: this.terrain 
    });
    // Integrate Maps API here
  }
}
