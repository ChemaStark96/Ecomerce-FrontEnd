import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/Cliente.model';
import { Pedido } from '../../models/Pedido.model';
import { ClientesService } from '../../services/clientes.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/Producto.model';

@Component({
  selector: 'app-principal',
  standalone: false,
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  clientes: Cliente[] = [];
  pedidos: Pedido[] = [];
  productos: Producto[] = [];
  selectedCliente: Cliente | null = null;
  form: FormGroup;

  constructor(
    private clienteService: ClientesService,
    private pedidoService: PedidosService,
    private productosService: ProductosService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      idCliente: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarClientes();
    this.listarProductos();

    this.form.get('idCliente')?.valueChanges.subscribe((valor: any) => {
      const id = Number(valor);
      this.selectedCliente = this.clientes.find(c => c.id === id) || null;

      // Obtener pedidos solo del cliente seleccionado
      this.pedidoService.getPedidos().subscribe({
        next: (resp: Pedido[]) => {
          this.pedidos = resp.filter(p => p.idCliente === id);
        },
        error: () => {
          console.error('No se pudieron obtener los pedidos');
        }
      });
    });
  }

  listarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (resp: Cliente[]) => {
        this.clientes = resp;
      }
    });
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (resp: Producto[]) => {
        this.productos = resp;
      }
    });
  }

  obtenerNombresProductos(ids: number[]): string {
    const nombres = ids.map(id => {
      const producto = this.productos.find(p => p.id === id);
      return producto ? producto.nombre : 'Producto no encontrado';
    });
    return nombres.join(', ');
  }
}
