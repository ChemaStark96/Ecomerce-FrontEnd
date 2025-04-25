import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/Producto.model';
import { ProductosService } from '../../services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  standalone: false,
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  productoForm: FormGroup;
  showForm: boolean = false;
  isEditMode: boolean = false;
  textoModal: string = 'Registrar Producto';
  selectedProducto: Producto | null = null;
  eliminandoId: number | null = null;
  guardando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService
  ) {
    this.productoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: resp => this.productos = resp,
      error: () => Swal.fire('Error', 'No se pudieron cargar los productos', 'error')
    });
  }

  toggleForm(): void {
    this.showForm = true;
    this.textoModal = 'Registrar Producto';
    this.isEditMode = false;
    this.selectedProducto = null;
    this.productoForm.reset();
  }

  onSubmit(): void {
    console.log('🚀 onSubmit ejecutado', this.productoForm.value);

    if (this.productoForm.invalid) return;

    this.guardando = true;
    const data = this.productoForm.value;

    if (this.isEditMode && data.id) {
      this.productosService.putProductos(data).subscribe({
        next: () => {
          Swal.fire('Producto actualizado', '', 'success');
          this.listarProductos();
          this.guardando = false;
          this.toggleForm();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
          this.guardando = false;
        }
      });
    } else {
      this.productosService.postProductos(data).subscribe({
        next: () => {
          Swal.fire('Producto creado', '', 'success');
          this.listarProductos();
          this.guardando = false;
          this.toggleForm();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el producto', 'error');
          this.guardando = false;
        }
      });
    }
  }

  editProducto(producto: Producto): void {
    this.selectedProducto = producto;
    this.isEditMode = true;
    this.textoModal = 'Editar Producto';
    this.showForm = true;
    this.productoForm.patchValue(producto);
  }

  eliminarProducto(producto: Producto): void {
    this.eliminandoId = producto.id;
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed && producto.id != null) {
        this.productosService.deleteProductos(producto.id).subscribe({
          next: () => {
            Swal.fire('Producto eliminado', '', 'success');
            this.listarProductos();
            this.eliminandoId = null;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            this.eliminandoId = null;
          }
        });
      } else {
        this.eliminandoId = null;
      }
    });
  }
}
