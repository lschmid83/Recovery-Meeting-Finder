import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_CHECKBOX_CLICK_ACTION, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-tri-state-checkbox',
  templateUrl: './tri-state-checkbox.component.html',
  styleUrls: ['./tri-state-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriStateCheckboxComponent),
      multi: true,
    },
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop' },
  ],
})
export class TriStateCheckboxComponent implements ControlValueAccessor {

  @Input() tape = [null, true, false];

  value: any;

  disabled: boolean;

  private onChange: (val: boolean) => void;
  private onTouched: () => void;

  writeValue(value: any) {
    this.value = value;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  next() {
    this.onChange(this.value = this.tape[(this.tape.indexOf(this.value) + 1) % this.tape.length]);
    this.onTouched();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
