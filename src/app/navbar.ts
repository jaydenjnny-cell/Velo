import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <nav class="h-16 flex items-center justify-between px-6 bg-slate-950/80 border-b border-white/5 sticky top-0 z-50">
      <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
        <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <mat-icon class="text-white text-base">directions_bike</mat-icon>
        </div>
        <span class="text-xl font-bold tracking-tight text-white">VeloRent</span>
      </div>

      <div class="flex items-center gap-4">
        <a routerLink="/" routerLinkActive="text-emerald-400" [routerLinkActiveOptions]="{exact: true}" class="hover:text-emerald-400 transition-colors hidden md:block">Bikes</a>
        <a routerLink="/route-planner" routerLinkActive="text-emerald-400" class="hover:text-emerald-400 transition-colors hidden md:block">Route Planner</a>
        
        @if (authService.user(); as user) {
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="overflow-hidden">
            <img [src]="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid" 
                 class="w-full h-full object-cover rounded-full" 
                 referrerpolicy="no-referrer">
          </button>
          <mat-menu #userMenu="matMenu" class="bg-slate-900 text-white">
            <div class="px-4 py-2 border-b border-white/5">
              <p class="font-semibold">{{ user.displayName }}</p>
              <p class="text-xs text-slate-400">{{ user.email }}</p>
            </div>
            <button mat-menu-item routerLink="/profile">
              <mat-icon>history</mat-icon>
              <span>Rentals</span>
            </button>
            @if (user.email === 'jaydenjnny@gmail.com') {
              <button mat-menu-item routerLink="/vendor" class="text-emerald-400">
                <mat-icon class="text-emerald-400">storefront</mat-icon>
                <span>Vendor Dashboard</span>
              </button>
            }
            <button mat-menu-item (click)="authService.logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        } @else {
          <button class="btn-primary py-2" (click)="authService.login()">
            <mat-icon>login</mat-icon>
            Sign In
          </button>
        }
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-menu-panel { background-color: #0f172a !important; }
    ::ng-deep .mat-mdc-menu-item { color: #f8fafc !important; }
  `]
})
export class Navbar {
  authService = inject(AuthService);
}
