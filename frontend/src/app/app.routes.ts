import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { VideoComponent } from './video/video.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'video', component: VideoComponent }
];
