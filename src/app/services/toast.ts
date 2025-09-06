import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: { message: string; type: string }[] = [];

  show(message: string, type: string = 'info') {
    this.toasts.push({ message, type });
    setTimeout(() => this.toasts.shift(), 4000);
  }
}
