import { Injectable } from '@angular/core';
import { Cliente } from '../models/Cliente.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl: string = enviroment.apiUrl +'cliente/';  

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.apiUrl);
  }
  
  postCliente(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.apiUrl,cliente);
  }

  putCliente(cliente: Cliente): Observable<Cliente>{
     return this.http.put<Cliente>(`${this.apiUrl}${cliente.id}`,cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

}
