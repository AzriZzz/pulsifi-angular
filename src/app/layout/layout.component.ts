import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-header>
        <div class="header-content">
          <h1>Employee Management Portal</h1>
          <div class="user-menu">
            <nz-avatar [nzText]="userInitials" nzSize="large"></nz-avatar>
            <a nz-dropdown [nzDropdownMenu]="menu" [nzTrigger]="'click'" [nzPlacement]="'bottomRight'">
              {{ userName }}
              <span nz-icon nzType="down"></span>
            </a>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item (click)="logout()">Logout</li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </div>
      </nz-header>
      <nz-layout>
        <nz-sider nzWidth="200px">
          <ul nz-menu nzMode="inline">
            <li nz-menu-item routerLink="/dashboard" routerLinkActive="ant-menu-item-selected">
              <span nz-icon nzType="dashboard"></span>
              <span>Dashboard</span>
            </li>
            <li nz-menu-item routerLink="/employees" routerLinkActive="ant-menu-item-selected">
              <span nz-icon nzType="team"></span>
              <span>Employees</span>
            </li>
            <li nz-menu-item routerLink="/roles" routerLinkActive="ant-menu-item-selected">
              <span nz-icon nzType="safety"></span>
              <span>Roles</span>
            </li>
          </ul>
        </nz-sider>
        <nz-content>
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
    }
    nz-header {
      background: #fff;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
      position: relative;
      z-index: 10;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      height: 100%;
    }
    h1 {
      margin: 0;
      font-size: 18px;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    nz-content {
      margin: 24px;
    }
    .content-container {
      padding: 24px;
      background: #fff;
      min-height: 360px;
    }
    nz-sider {
      background: #fff;
      border-right: 1px solid #f0f0f0;
    }
    [nz-menu] {
      height: 100%;
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  get userInitials(): string {
    const name = this.userName;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
} 