import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IApiProductModel } from './models/api-model';
import { environment } from './../../../environments/environment.development';

@Injectable({providedIn: 'root'})
export class ApiService {

    readonly URL_PRODUCT = environment.api + 'bp/products';
    readonly URL_VERIFY_PRODUCT = this.URL_PRODUCT + '/verification';

    constructor(private httpClient: HttpClient) { }
    
    getProduct() {
      return  this.httpClient.get<IApiProductModel[]>(this.URL_PRODUCT)
    }

    verifyProduct(id: string) {
      return this.httpClient.get<boolean>(`${this.URL_VERIFY_PRODUCT}?id=${id}`);
    }

    insertProduct(data: IApiProductModel) {
      return this.httpClient.post<IApiProductModel>(this.URL_PRODUCT, data)
    }

    updateProduct(data: IApiProductModel) {
      return this.httpClient.put<IApiProductModel>(this.URL_PRODUCT, data)
    }

    deleteProduct(id: string) {
      return this.httpClient.delete<any>(`${this.URL_PRODUCT}?id=${id}`);
    }

}