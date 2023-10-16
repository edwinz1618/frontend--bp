import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from './../../../environments/environment.development';
import { ApiService } from './api.service';
import { IApiProductModel } from './models/api-model';

describe('ServiceNameService', () => {
	let service: ApiService;
	let httpController: HttpTestingController;
	let URL_PRODUCT = environment.api + 'bp/products';
	let URL_VERIFY_PRODUCT = URL_PRODUCT + '/verification';

	const mockProduct: IApiProductModel = {
		id: '123',
		name: 'Test Product',
		description: 'tarjeta',
		logo: 'imagen',
		date_release: '12-12-2023',
		date_revision: '12-12-2023'
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
		service = TestBed.inject(ApiService);
		httpController = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return an array of products when calling getProduct()', () => {
		const mockProducts: IApiProductModel[] = [
			{
				id: '1',
				name: 'Product 1',
				description: 'Description 1',
				logo: 'logo1.png',
				date_release: '2022-01-01',
				date_revision: '2022-01-02'
			},
			{
				id: '2',
				name: 'Product 2',
				description: 'Description 2',
				logo: 'logo2.png',
				date_release: '2022-02-01',
				date_revision: '2022-02-02'
			}
		];

		service.getProduct().subscribe((res) => {
			expect(res).toEqual(mockProducts);
		});

		const req = httpController.expectOne({
			method: 'GET',
			url: URL_PRODUCT
		});

		req.flush(mockProducts);
	});

	it('should return a boolean when calling verifyProduct method', () => {
		const id = '123';

		service.verifyProduct(id).subscribe((res) => {
			expect(res).toBeTruthy();
		});

		const req = httpController.expectOne({
			method: 'GET',
			url: `${URL_VERIFY_PRODUCT}?id=${id}`
		});

		req.flush(true);
	});

	it('should return an IApiProductModel when calling insertProduct method', () => {
		// Arrange

		service.insertProduct(mockProduct).subscribe((res) => {
			expect(res).toEqual(mockProduct);
		});

		const req = httpController.expectOne({
			method: 'POST',
			url: URL_PRODUCT
		});

		req.flush(mockProduct);
	});

	it('should update a product with valid data', () => {
		service.updateProduct(mockProduct).subscribe((res) => {
			expect(res).toEqual(mockProduct);
		});

		const req = httpController.expectOne({
			method: 'PUT',
			url: URL_PRODUCT
		});

		req.flush(mockProduct);
	});
});
