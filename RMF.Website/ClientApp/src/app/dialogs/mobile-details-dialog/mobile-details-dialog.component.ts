import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IMeeting } from "../../meeting.interface";

@Component({
  selector: 'app-mobile-details-dialog',
  templateUrl: './mobile-details-dialog.component.html',
  styleUrls: ['./mobile-details-dialog.component.scss']
})
export class MobileDetailsDialogComponent implements OnInit {

  public meeting: IMeeting;
  public lat: number;
  public lng: number;

  constructor(private dialogRef: MatDialogRef<MobileDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.meeting = data.meeting;
    this.lat = data.lat;
    this.lng = data.lng;
  }

  ngOnInit() {
  }

  public close() : void {
    this.dialogRef.close();
  }

  // Format CSV
  public formatCsv(str: string) {
    return str.replace(/,/g, ', ');
  }
}

