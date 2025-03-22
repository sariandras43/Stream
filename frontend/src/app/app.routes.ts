import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { VideoComponent } from './components/video/video.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'video/:filename', component: VideoComponent }
];
