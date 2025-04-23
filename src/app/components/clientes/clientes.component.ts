import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/Cliente.model';
import { ClientesService } from '../../services/clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  standalone: false,
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  showForm: boolean = false;
  isEditMode: boolean = false;
  textoModal: string = 'Registrar Cliente';
  selectedCliente: Cliente | null = null;
  eliminandoId: number | null = null;
  guardando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {
    this.clienteForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (resp) => this.clientes = resp,
      error: (err) => Swal.fire('Error', 'No se pudieron cargar los clientes', 'error')
    });
  }

  toggleForm(): void {
  this.showForm = true;
  this.textoModal = 'Registrar Cliente';
  this.isEditMode = false;
  this.selectedCliente = null;
  this.clienteForm.reset();
}


  onSubmit(): void {
    console.log('🚀 onSubmit ejecutado');
    console.log('📦 Valores del formulario:', this.clienteForm.value);
  
    if (this.clienteForm.invalid) {
      console.warn('⚠️ Formulario inválido:', this.clienteForm);
      return;
    }
  
    this.guardando = true;
    const data = this.clienteForm.value;
  
    if (this.isEditMode && data.id) {
      this.clientesService.putCliente(data).subscribe({
        next: () => {
          Swal.fire('Cliente actualizado', '', 'success');
          this.listarClientes();
          this.guardando = false;
          this.toggleForm();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
          this.guardando = false;
        }
      });
    } else {
      this.clientesService.postCliente(data).subscribe({
        next: () => {
          Swal.fire('Cliente creado', '', 'success');
          this.listarClientes();
          this.guardando = false;
          this.toggleForm();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el cliente', 'error');
          this.guardando = false;
        }
      });
    }
  }
  

  editCliente(cliente: Cliente): void {
    this.selectedCliente = cliente;
    this.isEditMode = true;
    this.textoModal = 'Editar Cliente';
    this.showForm = true;
    this.clienteForm.patchValue(cliente);
  }

  eliminarCliente(cliente: Cliente): void {
    this.eliminandoId = cliente.id;
    Swal.fire({
      title: '¿Eliminar cliente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed && cliente.id != null) {
        this.clientesService.deleteCliente(cliente.id).subscribe({
          next: () => {
            Swal.fire('Cliente eliminado', '', 'success');
            this.listarClientes();
            this.eliminandoId = null;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
            this.eliminandoId = null;
          }
        });
      } else {
        this.eliminandoId = null;
      }
    });
  }
}
