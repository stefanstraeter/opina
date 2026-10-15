import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description Creates a validator that rejects dates before minDate.
 * minDate must be in the format YYYY-MM-DD.
 * An empty value is allowed, so optional fields still work.
 * @export
 * @param {string} minDate - The minimum date in the format YYYY-MM-DD.
 * @return {ValidatorFn} - The validator function that rejects dates before minDate.
 */
export function notBeforeDate(minDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) {
      return null;
    }
    return value < minDate ? { pastDate: true } : null;
  };
}
