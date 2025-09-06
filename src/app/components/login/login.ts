import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  login(): void {
    const payload = { email: this.email, password: this.password };

    this.auth.login(payload).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.toast.show(this.message, 'success');

        // ✅ redirect based on role
        if (res.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        this.message = err.error?.message || '❌ Login failed';
        this.toast.show(this.message, 'error');
        console.error('Login error:', err);
      }
    });
  }
}
