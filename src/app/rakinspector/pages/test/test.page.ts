import { Component, OnInit } from '@angular/core';
import { ComplaintService } from 'src/app/shared/services/complaint.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(private complaintService: ComplaintService) { }

  ngOnInit() {
  }

  createComplaint(lat: number, lon: number) {
    const result = this.complaintService.createComplaint(lat, lon);
    console.log(result);
  }

  showComplaints() {
    console.log(this.complaintService.getComplaints());
  }

}
