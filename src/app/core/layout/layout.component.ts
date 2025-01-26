import {
  Component,
  computed,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  signal,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AuthService } from '../services/auth.service';
import { PreferencesService } from '../services/preferences.service';
import { AcIfDirective } from '../../shared/directives/ac-if.directive';
import {
  DashboardOutline,
  TeamOutline,
  SafetyCertificateOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  DownOutline,
  LogoutOutline,
  ClearOutline,
  PlusOutline,
  EditOutline,
  DeleteOutline,
} from '@ant-design/icons-angular/icons';

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
        class="flex items-center justify-between px-6 bg-white shadow-sm fixed w-full z-10"
      >
        <div class="flex items-center gap-4">
          <span
            class="text-xl cursor-pointer lg:hidden"
            (click)="toggleSidebar()"
          >
            <span
              nz-icon
              [nzType]="isSidebarOpen() ? 'menu-fold' : 'menu-unfold'"
              nzTheme="outline"
            ></span>
          </span>
          <span class="text-xl font-semibold">Employee Portal</span>
        </div>
        <div class="flex items-center">
          <div>
            <a nz-dropdown [nzDropdownMenu]="menu">
              <div class="flex items-center cursor-pointer gap-2">
                <nz-avatar [nzText]="userInitials()" nzSize="large"></nz-avatar>
              </div>
            </a>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item (click)="logout()">
                  <span nz-icon nzType="logout" nzTheme="outline"></span>
                  <span class="ml-2">Logout</span>
                </li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </div>
      </nz-header>

      <nz-layout class="min-h-screen pt-16">
        <!-- Overlay -->
        <div
          *ngIf="isSidebarOpen() && isMobile()"
          class="fixed top-16 bottom-0 left-0 right-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300"
          (click)="toggleSidebar()"
        ></div>

        <!-- Sidebar -->
        <nz-sider
          class="fixed left-0 top-16 h-[calc(100vh-64px)] pt-2 transition-all duration-300 ease-in-out"
          [class.hidden]="!isSidebarOpen()"
          [class.lg:block]="true"
          [class.z-20]="isMobile()"
          [nzCollapsible]="true"
          [nzCollapsed]="isCollapsed()"
          (nzCollapsedChange)="onCollapse($event)"
          [nzWidth]="240"
        >
          <ul nz-menu nzMode="inline" class="h-full border-r">
            <li
              nz-menu-item
              routerLink="/dashboard"
              routerLinkActive="ant-menu-item-selected"
              (click)="isMobile() && toggleSidebar()"
            >
              <span nz-icon nzType="dashboard" nzTheme="outline"></span>
              <span class="sidebar-title">Dashboard</span>
            </li>
            <li
              nz-menu-item
              *acIf="'view_employees'"
              routerLink="/employees"
              routerLinkActive="ant-menu-item-selected"
              (click)="isMobile() && toggleSidebar()"
            >
              <span nz-icon nzType="team" nzTheme="outline"></span>
              <span class="sidebar-title">Employees</span>
            </li>
            <li
              nz-menu-item
              *acIf="'manage_roles'"
              routerLink="/roles"
              routerLinkActive="ant-menu-item-selected"
              (click)="isMobile() && toggleSidebar()"
            >
              <span
                nz-icon
                nzType="safety-certificate"
                nzTheme="outline"
              ></span>
              <span class="sidebar-title">Roles</span>
            </li>
          </ul>
        </nz-sider>

        <!-- Content -->
        <nz-content
          [ngStyle]="contentStyle()"
          class="p-6 transition-all duration-300 ease-in-out"
        >
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

      @media (max-width: 1024px) {
        nz-content {
          margin-left: 0 !important;
        }
      }

      .sidebar-title {
        position: relative;
        top: 2px;
      }

      :host ::ng-deep {
        .anticon {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
        }

        span.anticon {
          vertical-align: 1;
        }

        @media (max-width: 1024px) {
          .ant-layout-sider-trigger {
            display: none !important;
          }
        }
      }

      .bg-opacity-50 {
        --tw-bg-opacity: 0.5;
      }
    `,
  ],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly prefs = inject(PreferencesService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly iconService = inject(NzIconService);

  readonly isMobile = signal<boolean>(false);
  private readonly sidebarOpen = signal<boolean>(false);
  private readonly collapsed = signal<boolean>(false);

  constructor() {
    this.iconService.addIcon(
      ...[
        DashboardOutline,
        TeamOutline,
        SafetyCertificateOutline,
        MenuFoldOutline,
        MenuUnfoldOutline,
        DownOutline,
        LogoutOutline,
        ClearOutline,
        PlusOutline,
        EditOutline,
        DeleteOutline,
      ]
    );
  }

  readonly userName = computed(() => {
    const user = this.auth.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  readonly userInitials = computed(() => {
    const user = this.auth.getCurrentUser();
    return user ? `${user.firstName[0]}${user.lastName[0]}` : '';
  });

  readonly isCollapsed = computed(() => this.collapsed());
  readonly isSidebarOpen = computed(() => this.sidebarOpen());
  readonly contentStyle = computed(() => {
    if (window.innerWidth < 1024) {
      return {};
    }
    return {
      'margin-left': this.isCollapsed() ? '80px' : '240px',
    };
  });

  ngOnInit() {
    // Initialize states after component is created
    this.isMobile.set(window.innerWidth < 1024);
    this.sidebarOpen.set(window.innerWidth >= 1024);
    this.collapsed.set(this.prefs.getSidebarState());
  }

  ngAfterViewInit() {
    // Mark for check after view initialization
    this.cdr.detectChanges();
  }

  @HostListener('window:resize')
  onResize() {
    const mobile = window.innerWidth < 1024;
    this.isMobile.set(mobile);
    if (!mobile && !this.sidebarOpen()) {
      this.sidebarOpen.set(true);
    }
    this.cdr.detectChanges();
  }

  toggleSidebar() {
    this.sidebarOpen.update((open) => !open);
    this.cdr.detectChanges();
  }

  onCollapse(collapsed: boolean) {
    this.collapsed.set(collapsed);
    this.prefs.setSidebarState(collapsed);
    this.cdr.detectChanges();
  }

  logout(): void {
    this.auth.logout();
  }
}
