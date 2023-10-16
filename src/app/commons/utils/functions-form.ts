import { AbstractControl, ValidationErrors } from '@angular/forms';
const ERRORS_DEFAULT: ValidationErrors = {
	required: 'Este campo es requerido'
};
export const getFormControlError = (formControl: AbstractControl): string => {
	if (!formControl.touched || !formControl.errors) return '';

	const firstErrorKey = Object.keys(formControl.errors!)[0];

	if (formControl.errors[firstErrorKey] === true) {
		return ERRORS_DEFAULT[firstErrorKey];
	}

	return formControl.errors![firstErrorKey] || '';
};

export const convertDate = (date: string) => {
	const newDate = new Date(date);
	return new Date(newDate.getTime() + Math.abs(newDate.getTimezoneOffset() * 60000));
};
