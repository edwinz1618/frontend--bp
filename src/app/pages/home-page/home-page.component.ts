import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RoutesApp } from '../../commons/constants/routes-app';
import { ApiService } from '../../commons/services/api.service';
import { ModalService } from '../../commons/services/modal.service';
import { IApiProductModel } from '../../commons/services/models/api-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
	private readonly _productApiService = inject(ApiService);
	private readonly _router = inject(Router);
	private readonly _modalService = inject(ModalService);

	list: IApiProductModel[] = [];
	listTemp: IApiProductModel[] = [];
	total = 0;
	numberSelected = 5;
	listSkeleton = [1, 2, 3, 4, 5];
	showSkeleton = true;
	actualPage = 1;
	numberPages = 0;

	ngOnInit(): void {
		localStorage.setItem('sessionProduct', '');
		this._productList();
	}

	private _productList() {
		this._productApiService
			.getProduct()
			.pipe(finalize(() => (this.showSkeleton = false)))
			.subscribe((response) => {
				this.list = response;
				this.listTemp = response;
				this.total = this.list.length;
				this.numberPages = this._totalNumberPage();
			});
	}

	addProduct() {
		this._router.navigateByUrl(RoutesApp.URL_PRODUCT_NEW);
	}

	filter(event: Event) {
		const valorfiltro = (event.target as HTMLInputElement).value;
		this.list = this.listTemp.filter((f) => this._searchFilter(f, valorfiltro));
		this.total = this.list.length;
	}

	private _searchFilter(f: IApiProductModel, filterValue: string): boolean {
		return (
			f.name.toLocaleUpperCase().includes(filterValue.toLocaleUpperCase()) ||
			f.description.toLocaleUpperCase().includes(filterValue.toLocaleUpperCase())
		);
	}

	edit(data: IApiProductModel) {
		localStorage.setItem('sessionProduct', JSON.stringify(data));
		this._router.navigateByUrl(RoutesApp.URL_PRODUCT_EDIT);
	}

	openModalDelete(product: IApiProductModel) {
		const action = this._modalService.openModal({ title: product.name });
		action.subscribe(() => {
			this._delete(product.id);
		});
	}
	private _delete(id: string) {
		this._productApiService.deleteProduct(id).subscribe(() => {
			this._productList()
		}, () => this._productList());
	}

	showNumberElements(number: string) {
		this.numberSelected = Number(number);
		this.actualPage = 1;
		this.numberPages = this._totalNumberPage();
		this.getPaginatedElements();
	}

	nextPage(): void {
		if (this.actualPage < this._totalNumberPage()) {
			this.actualPage++;
		}
	}

	private _totalNumberPage(): number {
		return Math.ceil(this.list.length / this.numberSelected);
	}

	previewPage(): void {
		if (this.actualPage > 1) {
			this.actualPage--;
		}
	}

	getPaginatedElements(): IApiProductModel[] {
		const startIndex = (this.actualPage - 1) * this.numberSelected;
		const endIndex = startIndex + this.numberSelected;
		return this.list.slice(startIndex, endIndex);
	}
}
