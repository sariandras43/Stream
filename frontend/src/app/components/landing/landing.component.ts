import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VideoService } from '../../services/video.service';
import VideoModel from '../../../models/video.model';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  videos: VideoModel[] = [];
  errorMessage: string = '';

  constructor(private videoService: VideoService, public config:ConfigService) {}

  ngOnInit() {
   this.GetVideoNames();
  }

  private GetVideoNames() {
    return this.videoService.GetVideoFileNames().subscribe({
      next: (res: VideoModel[]) => (this.videos = res),
      error: (err: Error) => (this.errorMessage = err.message)
    });
  }
}
