import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
})
export class VideoComponent {
  filename:string|null =null;
  visibleFileName:string='';
  extension:string|null = null;

  constructor(private route: ActivatedRoute, private http:HttpClient, public config:ConfigService) {
    this.route.params.subscribe((params) => {
      this.filename = params['filename'];
      const splitFileName = this.filename!.split('.');
      for (let i = 0; i < splitFileName.length-1; i++) {
        this.visibleFileName+=splitFileName[i].replaceAll('.',' ').replaceAll('-',' ').replaceAll('_',' ');
      }
      this.extension = splitFileName[splitFileName.length-1];
    });
  }

}
