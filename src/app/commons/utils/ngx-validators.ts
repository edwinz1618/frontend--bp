import { ValidatorFn, Validators } from '@angular/forms';

const VALIDATOR_MESSAGE_DEFAULT = {
	required: 'Este campo es requerido',
	minLength: 'Longitud mínima de ${min} caracteres.',
	maxLength: 'Longitud máxima de ${min} caracteres.'
};

export class NgxValidators {
	static required(message?: string): ValidatorFn {
		return (control) => {
			const error = Validators.required(control);
			return error ? { required: this._getMessage('required', message) } : null;
		};
	}

	static minLength(minLength: number, message?: string): ValidatorFn {
		return (control) => {
			const minLengthFunction = Validators.minLength(minLength);
			const error = minLengthFunction(control);

			return error ? { max: this._getMessage('minLength', message, [{ min: minLength }]) } : null;
		};
	}

	static maxLength(minLength: number, message?: string): ValidatorFn {
		return (control) => {
			const maxLengthFunction = Validators.maxLength(minLength);
			const error = maxLengthFunction(control);

			return error ? { max: this._getMessage('maxLength', message, [{ min: minLength }]) } : null;
		};
	}

	private static _getMessage(
		control: keyof typeof VALIDATOR_MESSAGE_DEFAULT,
		message?: string,
		paramsMessage?: { [key: string]: unknown }[]
	) {
		if (message) return message;

		let messageControl = VALIDATOR_MESSAGE_DEFAULT[control];
		const existParams = paramsMessage && paramsMessage.length > 0;

		if (existParams) {
			paramsMessage.forEach((params) => {
				Object.keys(params)
					.filter((key) => params[key])
					.forEach((key) => {
						messageControl = messageControl.replace(`\${${key}}`, params[key]!.toString());
					});
			});

			return messageControl;
		}

		return messageControl;
	}
}
