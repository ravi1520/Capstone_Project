import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService,User } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '', role: 'User' };

  // ✅ declare message so template can use it
  message: string = '';

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  register(): void {
    this.auth.register(this.user).subscribe({
      next: () => {
        this.message = '✅ Registered successfully!';
        this.toast.show(this.message, 'success');
        this.router.navigate(['/login']); // redirect to login
      },
      error: () => {
        this.message = '❌ Registration failed!';
        this.toast.show(this.message, 'error');
      }
    });
  }
}
