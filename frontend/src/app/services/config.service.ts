import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  baseUrl="http://192.168.0.234:3000";
  constructor() { }
}
