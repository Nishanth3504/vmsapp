import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ExternalBrowserService {
  constructor(private platform: Platform) {}

  openExternalUrl(url: string): void {
    window.open(url, '_system', 'location=yes');
  }
}