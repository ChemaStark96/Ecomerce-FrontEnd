import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Pedido } from '../../models/Pedido.model';
import { Cliente } from '../../models/Cliente.model';
import { Producto } from '../../models/Producto.model';
import { PedidosService } from '../../services/pedidos.service';
import { ClientesService } from '../../services/clientes.service';
import { ProductosService } from '../../services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  standalone: false,
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];

  pedidoForm: FormGroup;
  showForm = false;
  isEditMode = false;
  textoModal = 'Registrar Pedido';
  selectedPedido: Pedido | null = null;
  eliminandoId: number | null = null;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    private clientesService: ClientesService,
    private productosService: ProductosService
  ) {
    this.pedidoForm = this.fb.group({
      id: [null],
      idCliente: [null, Validators.required],
      productos: this.fb.array([], Validators.required),
      total: [0],
      idEstatus: [1, Validators.required],
      fechaCreacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarPedidos();
    this.cargarClientes();
    this.cargarProductos();
  }

  listarPedidos(): void {
    this.pedidosService.getPedidos().subscribe({
      next: resp => {
        this.pedidos = resp.filter(p =>
          p.idEstatus === 1 || p.idEstatus === 2 || p.idEstatus === 3
        );
      },
      error: () => Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error')
    });
  }

  cargarClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: resp => this.clientes = resp
    });
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: resp => this.productos = resp
    });
  }

  obtenerNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.id === idCliente);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  }

  obtenerNombresProductos(idsProductos: number[]): string {
    const productosSeleccionados = idsProductos.map(id => {
      const producto = this.productos.find(p => p.id === id);
      return producto ? producto.nombre : 'Producto no encontrado';
    });
    return productosSeleccionados.join(', ');
  }
  

  // Obtención del FormArray
  get productosForm() {
    return this.pedidoForm.get('productos') as FormArray;
  }

  // Agregar un nuevo producto con cantidad al formulario
  addProducto(): void {
    const productoGroup = this.fb.group({
      idProducto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
    this.productosForm.push(productoGroup);
  }

  // Eliminar un producto del formulario
  removeProducto(index: number): void {
    this.productosForm.removeAt(index);
  }

  toggleForm(): void {
    this.showForm = true;
    this.textoModal = 'Registrar Pedido';
    this.isEditMode = false;
    this.selectedPedido = null;
  
    this.pedidoForm.reset();
    this.pedidoForm.get('idEstatus')?.setValue(1);
    this.pedidoForm.get('idCliente')?.enable();
    this.productosForm.clear(); // Limpiar los productos
  
    // Asegurar que nuevos controles vengan habilitados (en addProducto)
  }   

  onSubmit(): void {
    if (this.pedidoForm.invalid) return;
    this.guardando = true;

    const formValue = this.pedidoForm.getRawValue();

    const productosConCantidad: number[] = [];
    formValue.productos.forEach((producto: { idProducto: number; cantidad: number }) => {
      for (let i = 0; i < producto.cantidad; i++) {
        productosConCantidad.push(producto.idProducto);
      }
    });

    const data = { ...formValue, idProducto: productosConCantidad };

    if (this.isEditMode && data.id) {
      this.pedidosService.putPedidos(data).subscribe({
        next: () => {
          Swal.fire('Pedido actualizado', '', 'success');
          this.listarPedidos();
          this.guardando = false;
          this.toggleForm();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el pedido', 'error');
          this.guardando = false;
        }
      });
    } else {
      this.pedidosService.postPedidos(data).subscribe({
        next: () => {
          Swal.fire('Pedido creado', '', 'success');
          this.listarPedidos();
          this.guardando = false;
          this.toggleForm();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el pedido', 'error');
          this.guardando = false;
        }
      });
    }
  }

  editPedido(pedido: Pedido): void {
    if (pedido.idEstatus === 3 || pedido.idEstatus === 4) {
      Swal.fire('No editable', 'Este pedido no se puede editar', 'info');
      return;
    }
  
    this.selectedPedido = pedido;
    this.isEditMode = true;
    this.textoModal = 'Editar Pedido';
    this.showForm = true;
  
    this.pedidoForm.patchValue(pedido);
  
    // Deshabilitar el campo de cliente
    this.pedidoForm.get('idCliente')?.disable();
  
    // Limpiar y cargar los productos al form array
    const productosSeleccionados = pedido.idProducto.map(id => ({ idProducto: id, cantidad: 1 }));
    this.productosForm.clear();
    productosSeleccionados.forEach(producto => {
      const grupo = this.fb.group({
        idProducto: [{ value: producto.idProducto, disabled: true }, Validators.required],
        cantidad: [{ value: producto.cantidad, disabled: true }, [Validators.required, Validators.min(1)]]
      });
      this.productosForm.push(grupo);
    });
  }  

  eliminarPedido(pedido: Pedido): void {
    if (pedido.idEstatus === 4) return;

    this.eliminandoId = pedido.id;

    Swal.fire({
      title: '¿Cancelar pedido?',
      text: 'Esta acción marcará el pedido como cancelado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    }).then(result => {
      if (result.isConfirmed && pedido.id != null) {
        const cancelado: Pedido = { ...pedido, idEstatus: 4 };
        this.pedidosService.putPedidos(cancelado).subscribe({
          next: () => {
            Swal.fire('Pedido cancelado', '', 'success');
            this.listarPedidos(); // ya no se listará por el filtro de arriba
            this.eliminandoId = null;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo cancelar el pedido', 'error');
            this.eliminandoId = null;
          }
        });
      } else {
        this.eliminandoId = null;
      }
    });
  }
}
