import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthService } from '../../../core/services/auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TeamOutline, GithubOutline } from '@ant-design/icons-angular/icons';
import { NzIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzIconModule,
  ],
  template: `
    <div class="login-container">
      <div class="login-form">
        <nz-spin [nzSpinning]="isLoading">
          <h1>
            <span
              nz-icon
              nzType="team"
              nzTheme="outline"
              class="title-icon"
            ></span>
            Employee Management Portal
          </h1>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <nz-form-item>
              <nz-form-control [nzErrorTip]="emailError">
                <nz-input-group>
                  <input
                    type="email"
                    nz-input
                    formControlName="email"
                    placeholder="Email"
                  />
                </nz-input-group>
                <ng-template #emailError let-control>
                  <ng-container *ngIf="control.hasError('required')"
                    >Please input your email!</ng-container
                  >
                  <ng-container *ngIf="control.hasError('email')"
                    >Please input a valid email!</ng-container
                  >
                </ng-template>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-control [nzErrorTip]="passwordError">
                <nz-input-group>
                  <input
                    type="password"
                    nz-input
                    formControlName="password"
                    placeholder="Password"
                  />
                </nz-input-group>
                <ng-template #passwordError let-control>
                  <ng-container *ngIf="control.hasError('required')"
                    >Please input your password!</ng-container
                  >
                  <ng-container *ngIf="control.hasError('minlength')"
                    >Password must be at least 6 characters!</ng-container
                  >
                </ng-template>
              </nz-form-control>
            </nz-form-item>
            <button
              nz-button
              nzType="primary"
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Log in' }}
            </button>
          </form>
        </nz-spin>
      </div>
      <div class="footer">
        <span>Pulsifi Assessment - By Muhammad Azri</span>
        <a
          href="https://github.com/AzriZzz/pulsifi-angular"
          target="_blank"
          class="github-link"
        >
          <span nz-icon nzType="github" nzTheme="outline"></span>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f0f2f5;
        position: relative;
      }
      .login-form {
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        height: 100%;
        max-width: 400px;
        max-height: 280px;
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
      .title-icon {
        margin-right: 8px;
        font-size: 24px;
      }
      .footer {
        position: fixed;
        bottom: 24px;
        left: 0;
        right: 0;
        text-align: center;
        color: #8c8c8c;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .github-link {
        color: #8c8c8c;
        font-size: 16px;
        transition: color 0.3s;
      }
      .github-link:hover {
        color: #1890ff;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private iconService = inject(NzIconService);

  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this.iconService.addIcon(TeamOutline, GithubOutline);
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const result = await this.authService
          .login(this.loginForm.value)
          .toPromise();
        if (result) {
          const role = result.user.role.name.toLowerCase();
          if (role === 'admin') {
            await this.router.navigate(['/dashboard']);
          } else {
            await this.router.navigate(['/employees']);
          }
          this.message.success(`Welcome back, ${result.user.firstName}!`);
        }
      } catch (error: any) {
        this.message.error('Invalid email or password. Please try again.');
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
