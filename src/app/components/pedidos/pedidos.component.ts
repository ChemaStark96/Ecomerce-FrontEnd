import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from '../../models/Pedido.model';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  standalone: false,
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos: Pedido[] = [];
  pedidoForm: FormGroup;
  showForm: boolean = false;
  isEditMode: boolean = false;
  textoModal: string = 'Registrar Pedido';
  selectedPedido: Pedido | null = null;
  eliminandoId: number | null = null;
  guardando: boolean = false;

  constructor(private fb: FormBuilder) {
    this.pedidoForm = this.fb.group({
      id: [null],
      idCliente: [null, Validators.required],
      idProducto: [null, Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      idEstatus: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarPedidos();
    // Aquí cargar clientes y productos si llegan as er necesarios
  }

  listarPedidos(): void {
    // consumir this.pedidosService.getPedidos()...
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.textoModal = 'Registrar Pedido';
    this.isEditMode = false;
    this.selectedPedido = null;
    this.pedidoForm.reset();
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) return;
    this.guardando = true;

    const data = this.pedidoForm.value;

    if (this.isEditMode) {
      // pedidosService.actualizarPedido(data)
    } else {
      // pedidosService.crearPedido(data)
    }
    // this.listarPedidos();
    // this.guardando = false;
    // this.toggleForm();
  }

  editPedido(pedido: Pedido): void {
    this.selectedPedido = pedido;
    this.isEditMode = true;
    this.textoModal = 'Editar Pedido';
    this.showForm = true;
    this.pedidoForm.patchValue(pedido);
  }

  eliminarPedido(pedido: Pedido): void {
    this.eliminandoId = pedido.id;
    // pedidosService.eliminarPedido(pedido.id)
    // this.listarPedidos();
    // this.eliminandoId = null;
  }
}
