import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IMeeting } from "../../meeting.interface";

@Component({
  selector: 'app-accessibility-dialog',
  templateUrl: './accessibility-dialog.component.html',
  styleUrls: ['./accessibility-dialog.component.scss']
})
export class AccessibilityDialogComponent implements OnInit {

  public meeting: IMeeting;

  constructor(private dialogRef: MatDialogRef<AccessibilityDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.meeting = data.meeting;
  }

  ngOnInit() {
  }

  public close(): void {
    this.dialogRef.close();
  }
}
