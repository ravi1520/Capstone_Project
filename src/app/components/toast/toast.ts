import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let toast of toastService.toasts" class="toast {{toast.type}}">
      {{ toast.message }}
    </div>
  `,
  styleUrls: ['./toast.css']
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
