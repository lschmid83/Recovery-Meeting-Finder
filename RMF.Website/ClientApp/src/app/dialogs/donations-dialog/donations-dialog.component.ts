import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IMeeting } from "../../meeting.interface";

@Component({
  selector: 'app-donations-dialog',
  templateUrl: './donations-dialog.component.html',
  styleUrls: ['./donations-dialog.component.css']
})
export class DonationsDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DonationsDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
  }

  public close() : void {
    this.dialogRef.close();
  }
}

