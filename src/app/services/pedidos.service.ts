import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../models/Pedido.model';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl: string = environment.apiUrl + 'pedidos/';

  constructor(private http: HttpClient) { }

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  postPedidos(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  putPedidos(pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}${pedido.id}`, pedido);
  }

  deletePedidos(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
  getPedidosActivos(): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(this.apiUrl+'activos/');
  }
}
