import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/Producto.model';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl: string = environment.apiUrl +'productos/';  

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.apiUrl);
  }
  
  postProductos(producto: Producto): Observable<Producto>{
    return this.http.post<Producto>(this.apiUrl,producto);
  }

  putProductos(producto: Producto): Observable<Producto>{
     return this.http.put<Producto>(`${this.apiUrl}${producto.id}`,producto);
  }

  deleteProductos(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
  
}
