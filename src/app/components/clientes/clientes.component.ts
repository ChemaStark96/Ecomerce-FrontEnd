import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/Cliente.model';

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

  constructor(private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      direccion: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    //Aqui recibe lo de back
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.textoModal = 'Registrar Cliente';
    this.isEditMode = false;
    this.selectedCliente = null;
    this.clienteForm.reset();
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) return;

    this.guardando = true;

    const data = this.clienteForm.value;

    if (this.isEditMode && this.selectedCliente) {
      // consumo de this.clientesService.actualizarCliente(data)
    } else {
      // consumo de this.clientesService.crearCliente(data)
    }

    this.guardando = false;
    this.toggleForm();
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
    //Aqui va el borrado
  }
}