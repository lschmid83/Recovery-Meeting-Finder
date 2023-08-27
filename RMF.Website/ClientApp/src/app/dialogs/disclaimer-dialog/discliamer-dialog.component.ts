import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IMeeting } from "../../meeting.interface";

@Component({
  selector: 'app-disclaimer-dialog',
  templateUrl: './disclaimer-dialog.component.html',
  styleUrls: ['./disclaimer-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DisclaimerDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DisclaimerDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
  }

  public close(): void {
    this.dialogRef.close();
  }
}

