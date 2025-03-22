import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import VideoModel from '../../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  GetVideoFileNames(): Observable<VideoModel[]> {
    return this.http.get<VideoModel[]>(`${this.config.baseUrl}/videos`);
  }
}
