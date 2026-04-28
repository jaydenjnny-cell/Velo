import {Routes} from '@angular/router';
import {HomeComponent} from './home';
import {BikeDetailComponent} from './bike-detail';
import {ProfileComponent} from './profile';
import {VendorDashboardComponent} from './vendor-dashboard';
import {RoutePlannerComponent} from './route-planner';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'bike/:id', component: BikeDetailComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'vendor', component: VendorDashboardComponent},
  {path: 'route-planner', component: RoutePlannerComponent},
  {path: '**', redirectTo: ''},
];
