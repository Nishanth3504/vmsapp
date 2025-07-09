// src/app/services/complaint.service.ts
import { Injectable } from '@angular/core';

interface Complaint {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
    private complaints: Complaint[] = [
        { lat: 40.7128, lon: -74.0060 }, 
        { lat: 40.7130, lon: -74.0060 }, 
        { lat: 34.0522, lon: -118.2437 }, 
        { lat: 41.8781, lon: -87.6298 }, 
        { lat: 17.447215260245784, lon: 78.38643193505658 }, 
      ];
  private minimumDistance = 10; // Minimum distance in meters

  private getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
  }

  canCreateComplaint(newLat: number, newLon: number): boolean {
    for (const complaint of this.complaints) {
      const distance = this.getDistanceFromLatLonInMeters(newLat, newLon, complaint.lat, complaint.lon);
      if (distance < this.minimumDistance) {
        return false;
      }
    }
    return true;
  }

  createComplaint(lat: number, lon: number): string {
    if (this.canCreateComplaint(lat, lon)) {
      this.complaints.push({ lat, lon });
      return 'Complaint created successfully';
    } else {
      return 'Cannot create complaint: too close to an existing complaint';
    }
  }

  getComplaints(): Complaint[] {
    return this.complaints;
  }
}
