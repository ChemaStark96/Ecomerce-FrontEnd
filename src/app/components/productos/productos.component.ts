import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/Producto.model';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  standalone: false,
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {

  productos: Producto[] = [];
  productoForm: FormGroup;
  showForm: boolean = false;
  isEditMode: boolean = false;
  textoModal: string = 'Registrar Producto';
  selectedProducto: Producto | null = null;
  eliminandoId: number | null = null;
  guardando: boolean = false;

  constructor(private fb: FormBuilder, private productosService: ProductosService) {
    this.productoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (resp: Producto[]) => {
        this.productos = resp;
      }
    })
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.textoModal = 'Registrar Producto';
    this.isEditMode = false;
    this.selectedProducto = null;
    this.productoForm.reset();
  }

  onSubmit(): void {
    if (this.productoForm.invalid) return;
    this.guardando = true;

    const data = this.productoForm.value;

    if (this.isEditMode) {
      
      this.productosService.postProductos(data).subscribe({
        next: () => {
          this.listarProductos();
          this.guardando = false;
          this.toggleForm(); 
        },
        error: () => {

          this.guardando = false; 
        }
      });
    } else {
      this.productosService.putProductos(data).subscribe({
        next: () => {
          this.listarProductos(); // Se actualiza la lista de productos.
          this.guardando = false; // Se desactiva el indicador de guardado.
          this.toggleForm(); // Se cierra el formulario.
        },
        error: () => {
          // Manejo de errores en caso de fallo.
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
    if (producto.id !== null) {
      this.productosService.deleteProductos(producto.id).subscribe({
        next: () => this.listarProductos(),
        error: () => {
          // Manejo de errores en caso de fallo.
          console.error('Error al eliminar el producto', producto.id);
        }
      });
    }
    this.eliminandoId = null;
  }
}
