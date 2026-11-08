import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoComponent } from './pizzeria/pedido/pedido';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PedidoComponent],
  template: `<app-pedido></app-pedido>`,
  styleUrls: ['./app.css']
})
export class App {
  title = 'Exam_pizzeria';
}