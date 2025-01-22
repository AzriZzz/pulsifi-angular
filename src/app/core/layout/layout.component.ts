import {
  Component,
  computed,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AuthService } from '../services/auth.service';
import { AcIfDirective } from '../../shared/directives/ac-if.directive';

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
    NzAvatarModule,
    AcIfDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <nz-layout class="min-h-screen">
      <!-- Header -->
      <nz-header
        class="flex items-center justify-between px-6 bg-white shadow-sm"
      >
        <div class="flex items-center">
          <span class="text-xl font-semibold">Employee Portal</span>
        </div>
        <div class="flex items-center">
          <nz-dropdown [nzTrigger]="'click'" [nzPlacement]="'bottomRight'">
            <div class="flex items-center cursor-pointer" nz-dropdown>
              <nz-avatar [nzText]="userInitials()" nzSize="large"></nz-avatar>
              <span class="ml-2">{{ userName() }}</span>
            </div>
            <ul nz-menu>
              <li nz-menu-item (click)="logout()">Logout</li>
            </ul>
          </nz-dropdown>
        </div>
      </nz-header>

      <nz-layout>
        <!-- Sidebar -->
        <nz-sider [nzCollapsible]="true" [nzWidth]="240">
          <ul nz-menu nzMode="inline" class="h-full">
            <li
              nz-menu-item
              routerLink="/dashboard"
              routerLinkActive="ant-menu-item-selected"
            >
              <span nz-icon nzType="dashboard"></span>
              <span>Dashboard</span>
            </li>
            <li
              nz-menu-item
              *acIf="'view_employees'"
              routerLink="/employees"
              routerLinkActive="ant-menu-item-selected"
            >
              <span nz-icon nzType="team"></span>
              <span>Employees</span>
            </li>
            <li
              nz-menu-item
              *acIf="'manage_roles'"
              routerLink="/roles"
              routerLinkActive="ant-menu-item-selected"
            >
              <span nz-icon nzType="safety"></span>
              <span>Roles</span>
            </li>
          </ul>
        </nz-sider>

        <!-- Content -->
        <nz-content class="p-6">
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      nz-header {
        height: 64px;
        line-height: 64px;
      }

      nz-sider {
        background: #fff;
      }

      nz-content {
        background: #f0f2f5;
        min-height: calc(100vh - 64px);
      }
    `,
  ],
})
export class LayoutComponent {
  private readonly auth = inject(AuthService);

  readonly userName = computed(() => {
    const user = this.auth.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  readonly userInitials = computed(() => {
    const user = this.auth.getCurrentUser();
    return user ? `${user.firstName[0]}${user.lastName[0]}` : '';
  });

  logout(): void {
    this.auth.logout();
  }
}
