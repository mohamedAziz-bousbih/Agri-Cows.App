import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  model = { nom: '', password: '' };
  loading = false;
  error?: string;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.auth.login(this.model).subscribe({
      next: (res) => {
        this.auth.saveToken(res.access_token);
        this.router.navigate(['/vaches']);
      },
      error: (err) => {
        this.error = err?.error?.msg || 'Échec de connexion';
        this.loading = false;
      }
    });
  }
}
