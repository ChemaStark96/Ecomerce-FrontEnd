
import { Pedido } from '../../models/Pedido.model';
import { Cliente } from '../../models/Cliente.model';
import { ClientesService } from '../../services/clientes.service';
import { PedidosService } from '../../services/pedidos.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-principal',
  standalone: false,
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})

export class PrincipalComponent {
    clientes: Cliente[] = [];
    pedidos: Pedido[] = [];
    selectedCliente: Cliente | null = null;
    form: FormGroup;
    
    
  constructor(
    private clienteService: ClientesService,
    private pedidoService: PedidosService,
    private fb: FormBuilder
  ){
    this.form = fb.group({
      idCliente: ['',[Validators.required]], 
      idPedido: ['',[Validators.required]]   
    });

  }

  ngOnInit():void{ 
    this.listarPedidos();
    this.listarClientes();

    this.form.get('idCliente')?.valueChanges.subscribe((valor: any) => {
      const id = Number(valor);
      console.log('ID del cliente seleccionado:', id);
      this.selectedCliente = this.clientes.find(c => c.id === id) || null;
    });    
  }

  enviar() {
    const idSeleccionado = this.form.get('idCliente')?.value;
    console.log('ID seleccionado al enviar:', idSeleccionado);
    // Aquí puedes trabajar con el valor seleccionado (enviar al backend, etc.)
  }

  listarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (resp: Cliente[]) => {
        this.clientes = resp;
        console.log('Clientes loaded:', this.clientes);
      }
    });
  }

  listarPedidos(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (resp: Pedido[]) => {
        this.pedidos = resp;
        console.log('Pedidos loaded:', this.pedidos);
      }
    });
  }



}
