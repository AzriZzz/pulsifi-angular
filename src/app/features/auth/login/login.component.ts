import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h1>Employee Management Portal</h1>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your email!">
              <nz-input-group>
                <input type="email" nz-input formControlName="email" placeholder="Email" />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your password!">
              <nz-input-group>
                <input type="password" nz-input formControlName="password" placeholder="Password" />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
          <button nz-button nzType="primary" [disabled]="loginForm.invalid">Log in</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f0f2f5;
    }
    .login-form {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }
    nz-form-item {
      margin-bottom: 1rem;
    }
    button {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private message = inject(NzMessageService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        await this.authService.login(this.loginForm.value);
        await this.router.navigate(['/dashboard']);
      } catch (error: any) {
        this.message.error('Invalid email or password');
      }
    }
  }
} 