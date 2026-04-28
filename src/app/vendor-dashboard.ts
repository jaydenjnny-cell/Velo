import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BikeService } from './core/services/bike';
import { db } from './core/firebase.config';
import { collection, addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex items-center gap-4 mb-10">
        <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
          <mat-icon class="text-white">admin_panel_settings</mat-icon>
        </div>
        <div>
          <h1 class="text-3xl font-bold">Vendor Dashboard</h1>
          <p class="text-slate-400 text-sm">Manage your fleet and add new inventory in real-time.</p>
        </div>
      </div>

      <div class="glass-card p-8 border-emerald-500/20">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <mat-icon class="text-emerald-400">add_circle</mat-icon>
          Add New Bicycle
        </h2>

        <form [formGroup]="bikeForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Bike Name</mat-label>
              <input matInput formControlName="name" placeholder="e.g. Carbon Master 3000">
              <mat-icon matPrefix class="mr-2">directions_bike</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Type</mat-label>
              <mat-select formControlName="type">
                @for (type of bikeTypes; track type) {
                  <mat-option [value]="type">{{ type | titlecase }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Price per Hour ($)</mat-label>
              <input matInput type="number" formControlName="pricePerHour">
              <mat-icon matPrefix class="mr-2">payments</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Weight (e.g. 12kg)</mat-label>
              <input matInput formControlName="weight">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Gears</mat-label>
              <input matInput formControlName="gears" placeholder="e.g. 21 Speed">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Image URL</mat-label>
            <input matInput formControlName="imageUrl" placeholder="https://unsplash.com/...">
            <mat-icon matPrefix class="mr-2">image</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="4" placeholder="Tell users about this bike..."></textarea>
          </mat-form-field>

          <div class="flex justify-end pt-4">
            <button class="btn-primary px-10 py-4 shadow-xl shadow-emerald-500/20" [disabled]="bikeForm.invalid || isSubmitting()">
              <mat-icon>{{ isSubmitting() ? 'sync' : 'publish' }}</mat-icon>
              {{ isSubmitting() ? 'Adding to Fleet...' : 'Deploy to Catalog' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Quick Tips -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
          <h4 class="font-bold text-blue-400 mb-2 flex items-center gap-2">
            <mat-icon class="scale-75">info</mat-icon>
            High Resolution
          </h4>
          <p class="text-sm text-slate-400">Use high-quality Unsplash images (e.g., width=2000) for the best visual appeal in the catalog.</p>
        </div>
        <div class="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10">
          <h4 class="font-bold text-purple-400 mb-2 flex items-center gap-2">
            <mat-icon class="scale-75">bolt</mat-icon>
            Real-time Sync
          </h4>
          <p class="text-sm text-slate-400">Inventory is updated instantly. No page reload is required for users browsing the site.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-form-field { width: 100%; }
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    ::ng-deep .mat-mdc-form-field-focus-overlay { background-color: rgba(16, 185, 129, 0.05); }
    ::ng-deep .mat-mdc-text-field-wrapper { background-color: rgba(255, 255, 255, 0.02); }
  `]
})
export class VendorDashboardComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private bikeService = inject(BikeService);

  isSubmitting = signal(false);
  bikeTypes = ['road', 'mountain', 'electric', 'hybrid'];

  bikeForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    type: ['road', [Validators.required]],
    pricePerHour: [15, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    weight: ['12kg', [Validators.required]],
    gears: ['12 Speed', [Validators.required]],
    frame: ['Carbon fiber'], // simplified for form
  });

  async onSubmit() {
    if (this.bikeForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.bikeForm.value;

    const newBike = {
      name: formValue.name,
      type: formValue.type,
      pricePerHour: formValue.pricePerHour,
      description: formValue.description,
      imageUrl: formValue.imageUrl,
      available: true,
      rating: 5.0,
      reviewsCount: 0,
      specs: {
        weight: formValue.weight,
        gears: formValue.gears,
        frame: formValue.frame || 'Standard'
      }
    };

    try {
      await addDoc(collection(db, 'bikes'), newBike);
      this.snackBar.open('Bicycle added to fleet successfully!', 'Success', {
        duration: 3000,
        panelClass: ['bg-emerald-500', 'text-white']
      });
      this.bikeForm.reset({
        type: 'road',
        pricePerHour: 15,
        weight: '12kg',
        gears: '12 Speed'
      });
    } catch (error) {
      console.error('Error adding bike:', error);
      this.snackBar.open('Permission denied or network error.', 'Error', { duration: 3000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
