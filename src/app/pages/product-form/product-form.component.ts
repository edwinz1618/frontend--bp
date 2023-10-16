import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, concatMap } from 'rxjs';
import { RoutesApp } from '../../commons/constants/routes-app';
import { ApiService } from '../../commons/services/api.service';
import { IApiProductModel } from '../../commons/services/models/api-model';
import { convertDate, getFormControlError } from '../../commons/utils/functions-form';
import { NgxValidators } from '../../commons/utils/ngx-validators';
import { validDate } from './validator';

@Component({
	selector: 'app-product-form',
	standalone: true,
	imports: [NgClass, NgIf, DatePipe, RouterLink, ReactiveFormsModule],
	templateUrl: './product-form.component.html',
	styleUrls: ['./product-form.component.scss'],
	providers: [DatePipe]
})
export default class ProductFormComponent implements OnInit {
	private readonly _productApiService = inject(ApiService);
	private readonly _fb = inject(NonNullableFormBuilder);
	private readonly _router = inject(Router);
	private readonly _activateRoute = inject(ActivatedRoute);
	private readonly _datePipe = inject(DatePipe);
	currentDate = new Date();
	msgValidation = '';
	action = '';
	isEdit = false;
	title = 'Registro';
	isLoading = false;
	form = this._fb.group({
		id: ['', [NgxValidators.required(), NgxValidators.minLength(3), NgxValidators.maxLength(10)]],
		name: ['', [NgxValidators.required(), NgxValidators.minLength(5), NgxValidators.maxLength(100)]],
		description: ['', [NgxValidators.required(), NgxValidators.minLength(10), NgxValidators.maxLength(200)]],
		logo: ['', NgxValidators.required()],
		releaseDate: ['', [NgxValidators.required(), validDate]],
		reviewDate: [{ value: '', disabled: true }, NgxValidators.required()]
	});

	ngOnInit(): void {
		this.action = this._activateRoute.snapshot.paramMap.get('action')!;
		this.isEdit = this.action == 'edit';
		this._loadEdit();
	}

	private _loadEdit() {
		if (this.isEdit) {
			const productEdit: IApiProductModel = JSON.parse(localStorage.getItem('sessionProduct')!);
			this.form.patchValue({
				id: productEdit.id,
				name: productEdit.name,
				description: productEdit.description,
				logo: productEdit.logo,
				releaseDate: this._datePipe.transform(productEdit.date_release, 'yyyy-MM-dd')!,
				reviewDate: this._datePipe.transform(productEdit.date_revision, 'dd/MM/yyyy')!
			});
			this.title = 'Edición';
			this.idField.disable();
		}
	}

	insertProduct(): void {
		this.form.markAllAsTouched();
		if (this.form.invalid) return;

		this.isLoading = true;
		const { id, description, name, logo, releaseDate, reviewDate } = this.form.getRawValue();
		const revDate = reviewDate.split('/').reverse().join('-');
		const request: IApiProductModel = {
			id,
			description,
			name,
			logo,
			date_release: releaseDate,
			date_revision: revDate
		};
		this.isEdit ? this._updateProduct(request) : this._registerProduct(request);
	}

	private _registerProduct(product: IApiProductModel) {
		this._productApiService
			.verifyProduct(product.id)
			.pipe(
				concatMap((response) => {
					this.msgValidation = response ? 'El código ya existe' : '';
					this.isLoading = false;
					return response ? EMPTY : this._productApiService.insertProduct(product);
				})
			)
			.subscribe(() => {
				this.isLoading = false;
				this._router.navigateByUrl(RoutesApp.URL_HOME);
			});
	}

	private _updateProduct(product: IApiProductModel) {
		this.isLoading = false;
		this._productApiService.updateProduct(product).subscribe(() => this._router.navigateByUrl(RoutesApp.URL_HOME));
	}

	getError(formControl: AbstractControl) {
		return getFormControlError(formControl);
	}

	getReviewDate() {
		const dateSelected = this.releaseDateField.value;
		if (dateSelected) {
			const newDate = convertDate(dateSelected);
			newDate.setFullYear(newDate.getFullYear() + 1);
			this.reviewDateField.setValue(this._datePipe.transform(newDate, 'dd/MM/yyyy')!);
		}
	}

	restart() {
		this.msgValidation = '';
		const id = this.idField.value;
		this.form.markAsUntouched();
		this.form.reset();
		if (this.isEdit) {
			this.idField.setValue(id);
		}
	}

	get idField() {
		return this.form.controls.id;
	}

	get nameField() {
		return this.form.controls.name;
	}

	get descriptionField() {
		return this.form.controls.description;
	}

	get logoField() {
		return this.form.controls.logo;
	}

	get releaseDateField() {
		return this.form.controls.releaseDate;
	}

	get reviewDateField() {
		return this.form.controls.reviewDate;
	}
}
