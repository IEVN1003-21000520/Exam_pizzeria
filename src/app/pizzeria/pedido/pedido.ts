import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from './pedido.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class PedidoComponent implements OnInit {
  nombreCliente: string = '';
  telefono: string = '';
  direccion: string = '';

  pizzaActual = {
    tamano: 'Mediana',
    ingredientes: '',
    cantidad: 1
  };

  listaPizzasDetalle: any[] = [];
  listaPedidosRegistrados: any[] = [];
  idPedidoEnEdicion: number | null = null;
  
  pedidoSeleccionado: any = null;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  agregarPizza() {
    let precioUnitario = 120;
    if (this.pizzaActual.tamano === 'Grande') precioUnitario = 160;
    if (this.pizzaActual.tamano === 'Familiar') precioUnitario = 200;

    const subtotal = precioUnitario * this.pizzaActual.cantidad;

    this.listaPizzasDetalle.push({
      tamano: this.pizzaActual.tamano,
      ingredientes: this.pizzaActual.ingredientes,
      cantidad: this.pizzaActual.cantidad,
      subtotal: subtotal
    });

    this.pizzaActual = { tamano: 'Mediana', ingredientes: '', cantidad: 1 };
  }

  quitarPizza(index: number) {
    this.listaPizzasDetalle.splice(index, 1);
  }

  calcularTotal(): number {
    return this.listaPizzasDetalle.reduce((acc, p) => acc + p.subtotal, 0);
  }

  guardarPedido() {
    const pedidoData = {
      nombre_cliente: this.nombreCliente,
      telefono: this.telefono,
      direccion: this.direccion,
      total: this.calcularTotal(),
      pizzas: this.listaPizzasDetalle
    };

    if (this.idPedidoEnEdicion !== null) {
      this.pedidoService.actualizarPedido(this.idPedidoEnEdicion, pedidoData).subscribe({
        next: () => {
          alert('Pedido actualizado con éxito');
          this.limpiarFormulario();
          this.cargarPedidos();
        },
        error: (err) => {
          alert('Hubo un error al actualizar el pedido.');
          console.error(err);
        }
      });
    } else {
      this.pedidoService.guardarPedido(pedidoData).subscribe({
        next: () => {
          alert('Pedido guardado con éxito');
          this.limpiarFormulario();
          this.cargarPedidos();
        },
        error: (err) => {
          alert('Hubo un error al conectar con el servidor.');
          console.error(err);
        }
      });
    }
  }

  cargarPedidos() {
    this.pedidoService.obtenerPedidos().subscribe({
      next: (data) => {
        this.listaPedidosRegistrados = [...data];
      },
      error: (err) => {
        console.error('Error al cargar la lista de pedidos', err);
      }
    });
  }

  eliminarPedido(id: number) {
    if (confirm('¿Estás segura de que deseas eliminar este pedido?')) {
      this.pedidoService.eliminarPedido(id).subscribe({
        next: () => {
          alert('Pedido eliminado correctamente');
          this.cargarPedidos();
        },
        error: (err) => {
          console.error('Error al eliminar el pedido', err);
        }
      });
    }
  }

  cargarPedidoParaEditar(p: any) {
    this.idPedidoEnEdicion = p.pedido_id !== undefined ? p.pedido_id : p.id;
    this.nombreCliente = p.nombre_cliente;
    this.telefono = p.telefono;
    this.direccion = p.direccion;
    this.listaPizzasDetalle = p.pizzas ? [...p.pizzas] : [];
  }

  verDetallePedido(p: any) {
    this.pedidoSeleccionado = p;
  }

  cerrarModalDetalle() {
    this.pedidoSeleccionado = null;
  }

  limpiarFormulario() {
    this.idPedidoEnEdicion = null;
    this.nombreCliente = '';
    this.telefono = '';
    this.direccion = '';
    this.listaPizzasDetalle = [];
  }
}