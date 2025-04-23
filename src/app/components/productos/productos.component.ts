import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/Producto.model';

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

  constructor(private fb: FormBuilder) {
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
    //  Aquí se consume this.productosService.getProductos()...
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
      //  Aquí se consume this.productosService.actualizarProducto(data)
    } else {
      // Aquí se consume this.productosService.crearProducto(data)
    }

    // Luego de consumir:
    // this.listarProductos();
    // this.guardando = false;
    // this.toggleForm();
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
    //  Aquí va this.productosService.eliminarProducto(producto.id)
    // this.listarProductos();
    // this.eliminandoId = null;
  }
}
