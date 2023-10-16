import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SkeletonComponent } from '../../commons/components/skeleton/skeleton.component';
import { RoutesApp } from '../../commons/constants/routes-app';
import { ApiService } from '../../commons/services/api.service';
import { ModalService } from '../../commons/services/modal.service';
import { IApiProductModel } from '../../commons/services/models/api-model';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
	let component: HomePageComponent;
	let fixture: ComponentFixture<HomePageComponent>;
	let apiService: ApiService;
	let router: Router;
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
		},
		{
			id: '3',
			name: 'Product 3',
			description: 'Description 3',
			logo: 'logo3.png',
			date_release: '2022-02-01',
			date_revision: '2022-02-02'
		}
	];

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
			declarations: [HomePageComponent],
			imports: [HttpClientTestingModule, SkeletonComponent],
			providers: [ApiService, ModalService]
		});
		fixture = TestBed.createComponent(HomePageComponent);
		component = fixture.componentInstance;
		apiService = TestBed.inject(ApiService);
		router = TestBed.inject(Router);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize the component correctly', () => {
		expect(component.list).toEqual([]);
		expect(component.showSkeleton).toBe(true);
		expect(component.total).toBe(0);
		expect(component.numberSelected).toBe(5);
		expect(component.listTemp).toEqual([]);
		expect(component.actualPage).toBe(1);
		expect(component.numberPages).toBe(0);
	});

	it('should call _productList method on ngOnInit', () => {
		const getProductSpy = jest.spyOn(apiService, 'getProduct').mockReturnValue(of([]));

		component.ngOnInit();

		expect(getProductSpy).toHaveBeenCalled();
	});

	it('should set list and listTemp on _productList method call', () => {
		jest.spyOn(apiService, 'getProduct').mockReturnValue(of(mockProducts));

		component.ngOnInit();

		expect(component.list).toEqual(mockProducts);
		expect(component.listTemp).toEqual(mockProducts);
	});

	it('should call _searchFilter when filtering', () => {
		const _searchFilterSpy = jest.spyOn(component as any, '_searchFilter');
		component.listTemp = mockProducts;

		const event = {
			target: {
				value: 'Product 1'
			}
		};
		component.filter(event as any);

		expect(_searchFilterSpy).toHaveBeenCalledWith(component.listTemp[0], 'Product 1');
		expect(_searchFilterSpy).toHaveBeenCalledWith(component.listTemp[1], 'Product 1');
	});

	it('should navigate to add product page on addProduct call', () => {
		const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');

		component.addProduct();

		expect(navigateByUrlSpy).toHaveBeenCalledWith(RoutesApp.URL_PRODUCT_NEW);
	});

	it('should set sessionProduct on edit', () => {
		const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
		jest.spyOn(apiService, 'getProduct').mockReturnValue(of([mockProduct]));

		component.ngOnInit(); // Cargar datos en la lista
		component.edit(mockProduct);

		expect(setItemSpy).toHaveBeenCalledWith('sessionProduct', JSON.stringify(mockProduct));
	});

	it('should open modal and delete on openModalDelete', () => {
		const openModalSpy = jest.spyOn(component['_modalService'], 'openModal').mockReturnValue(of(true));
		const deleteProductSpy = jest.spyOn(apiService, 'deleteProduct').mockReturnValue(of(null));

		component.openModalDelete(mockProduct);

		expect(openModalSpy).toHaveBeenCalledWith({ title: mockProduct.name });
		expect(deleteProductSpy).toHaveBeenCalledWith(mockProduct.id);
	});

	it('should set numberSelected, actualPage, and numberPages on showNumberElements', () => {
		const number = '10';
		component.numberSelected = 5;
		component.actualPage = 2;

		component.showNumberElements(number);

		expect(component.numberSelected).toBe(10);
		expect(component.actualPage).toBe(1); // Reinicia la página a 1
		expect(component.numberPages).toBe(component['_totalNumberPage']());
	});

	it('should increment actualPage by 1 on nextPage', () => {
		component.actualPage = 2;
		component.numberSelected = 5;
		component.list = mockProducts;

		component.nextPage();

		expect(component.actualPage).toBe(2);
	});

	it('should decrement actualPage by 1 on previewPage', () => {
		component.actualPage = 3;

		component.previewPage();

		expect(component.actualPage).toBe(2);
		expect(component.actualPage).toBeGreaterThanOrEqual(1);
	});

	it('should calculate total number of pages correctly', () => {
		component.list = mockProducts;
		component.numberSelected = 2;

		const totalNumberPage = component['_totalNumberPage']();

		expect(totalNumberPage).toBe(2); // Debería haber 2 páginas
	});
});
