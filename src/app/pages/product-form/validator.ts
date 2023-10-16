import { AbstractControl, ValidationErrors } from '@angular/forms';
import { convertDate } from '../../commons/utils/functions-form';

export const validDate = (control: AbstractControl): ValidationErrors | null => {
	const valor = convertDate(control.value);
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);

	if (valor && currentDate.getTime() <= valor.getTime()) {
		return null;
	}
	return { releaseDateInvalidDate: 'La fecha no debe ser menor a la fecha actual' };
};
