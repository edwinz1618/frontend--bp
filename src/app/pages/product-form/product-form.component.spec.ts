import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RoutesApp } from '../../commons/constants/routes-app';
import { ApiService } from '../../commons/services/api.service';
import { IApiProductModel } from '../../commons/services/models/api-model';
import ProductFormComponent from './product-form.component';

describe('ProductFormComponent', () => {
	let component: ProductFormComponent;
	let fixture: ComponentFixture<ProductFormComponent>;

	const mockProduct: IApiProductModel = {
		id: '123',
		name: 'Test Product',
		description: 'tarjeta',
		logo: 'imagen',
		date_release: '12-12-2023',
		date_revision: '12-12-2023'
	};

	const mockApiService = {
		verifyProduct: jest.fn(),
		insertProduct: jest.fn(),
		updateProduct: jest.fn()
	};

	const mockRouter = {
		navigateByUrl: jest.fn()
	};

	const mockActivatedRoute = {
		snapshot: {
			paramMap: {
				get: jest.fn()
			}
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, ProductFormComponent],
			providers: [
				{ provide: ApiService, useValue: mockApiService },
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				DatePipe
			]
		});

		fixture = TestBed.createComponent(ProductFormComponent);
		localStorage.setItem('sessionProduct', JSON.stringify(mockProduct));
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// it('should initialize correctly in create mode', () => {
	// 	expect(component.action).toBe('');
	// 	expect(component.isEdit).toBe(false);
	// 	expect(component.title).toBe('Registro');
	// });

	// it('should initialize correctly in edit mode', () => {
	// 	mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('edit');
	// 	fixture.detectChanges();

	// 	expect(component.action).toBe('edit');
	// 	expect(component.isEdit).toBe(true);
	// 	expect(component.title).toBe('Edición');
	// });

	// it('should load edit data', () => {
	// 	mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('edit');
	// 	const productData = {
	// 		id: '123',
	// 		name: 'Product 1',
	// 		description: 'Description 1',
	// 		logo: 'logo1',
	// 		date_release: '2023-10-16',
	// 		date_revision: '2023-10-16'
	// 	};

	// 	localStorage.setItem('sessionProduct', JSON.stringify(productData));
	// 	fixture.detectChanges();

	// 	expect(component.idField.value).toBe(productData.id);
	// 	expect(component.nameField.value).toBe(productData.name);
	// 	expect(component.descriptionField.value).toBe(productData.description);
	// 	expect(component.logoField.value).toBe(productData.logo);
	// 	expect(component.releaseDateField.value).toBe(productData.date_release);
	// 	expect(component.reviewDateField.value).toBe(productData.date_revision);
	// });

	// it('should not load edit data if not in edit mode', () => {
	// 	mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('create');
	// 	const productData = {
	// 		id: '123',
	// 		name: 'Product 1',
	// 		description: 'Description 1',
	// 		logo: 'logo1',
	// 		date_release: '2023-10-16',
	// 		date_revision: '16/10/2024'
	// 	};

	// 	localStorage.setItem('sessionProduct', JSON.stringify(productData));
	// 	fixture.detectChanges();

	// 	expect(component.idField.value).toBe('');
	// 	expect(component.nameField.value).toBe('');
	// 	expect(component.descriptionField.value).toBe('');
	// 	expect(component.logoField.value).toBe('');
	// 	expect(component.releaseDateField.value).toBe('');
	// 	expect(component.reviewDateField.value).toBe('');
	// });

	// it('should set error message if product code already exists', () => {
	// 	mockApiService.verifyProduct.mockReturnValue(of(true));
	// 	component.insertProduct();
	// 	expect(component.msgValidation).toBe('El código ya existe');
	// });

	// it('should clear error message if product code is valid', () => {
	// 	mockApiService.verifyProduct.mockReturnValue(of(true));
	// 	component.insertProduct();
	// 	expect(component.msgValidation).toBe('El código ya existe');
	// });

	it('should register product in create mode', () => {
		const productData = {
			id: '123',
			name: 'Product 1',
			description: 'Description 1',
			logo: 'logo1',
			date_release: '2023-10-16',
			date_revision: '16/10/2024'
		};

		component.idField.setValue(productData.id);
		component.nameField.setValue(productData.name);
		component.descriptionField.setValue(productData.description);
		component.logoField.setValue(productData.logo);
		component.releaseDateField.setValue(productData.date_release);
		component.reviewDateField.setValue(productData.date_revision);

		mockApiService.verifyProduct.mockReturnValue(of(false));
		mockApiService.insertProduct.mockReturnValue(of(true));

		component.insertProduct();

		expect(component.isLoading).toBe(false);
		expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(RoutesApp.URL_HOME);
	});

	it('should update product in edit mode', () => {
		const productData = {
			id: '123',
			name: 'Product 1',
			description: 'Description 1',
			logo: 'logo1',
			date_release: '2023-10-16',
			date_revision: '16/10/2024'
		};

		component.idField.setValue(productData.id);
		component.nameField.setValue(productData.name);
		component.descriptionField.setValue(productData.description);
		component.logoField.setValue(productData.logo);
		component.releaseDateField.setValue(productData.date_release);
		component.reviewDateField.setValue(productData.date_revision);

		mockApiService.verifyProduct.mockReturnValue(of(false));
		mockApiService.updateProduct.mockReturnValue(of(true));

		component.insertProduct();

		expect(component.isLoading).toBe(false);
		expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(RoutesApp.URL_HOME);
	});

	it('should handle error when registering product', () => {
		mockApiService.verifyProduct.mockReturnValue(of(false));
		mockApiService.insertProduct.mockReturnValue(throwError('Error'));
		component.insertProduct();
		expect(component.isLoading).toBe(false);
	});

	it('should handle error when updating product', () => {
		mockApiService.verifyProduct.mockReturnValue(of(false));
		mockApiService.updateProduct.mockReturnValue(throwError('Error'));
		component.insertProduct();
		expect(component.isLoading).toBe(false);
	});

	// it('should calculate review date', () => {
	//   const currentDate = new Date('2023-10-16');
	//   component.releaseDateField.setValue(currentDate);
	//   const oneYearLater = new Date('2024-10-16');
	//   component.getReviewDate();
	//   expect(component.reviewDateField.value).toBe('16/10/2024');
	// });

	it('should reset form and clear error message', () => {
		component.msgValidation = 'El código ya existe';
		component.idField.setValue('123');
		component.nameField.setValue('Product 1');
		component.descriptionField.setValue('Description 1');
		component.logoField.setValue('logo1');
		component.releaseDateField.setValue('2023-10-16');
		component.reviewDateField.setValue('16/10/2024');

		component.restart();

		expect(component.msgValidation).toBe('');
		expect(component.form.untouched).toBe(true);
		expect(component.form.pristine).toBe(true);
		expect(component.idField.value).toBe('');
		expect(component.nameField.value).toBe('');
		expect(component.descriptionField.value).toBe('');
		expect(component.logoField.value).toBe('');
		expect(component.releaseDateField.value).toBe('');
		expect(component.reviewDateField.value).toBe('');
	});
});
