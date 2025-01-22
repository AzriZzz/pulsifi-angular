import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Welcome, {{ userName }}!</h1>
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="150"
              [nzTitle]="'Total Employees'"
            ></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="10"
              [nzTitle]="'Departments'"
            ></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="5"
              [nzTitle]="'Roles'"
            ></nz-statistic>
          </nz-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }
    h1 {
      margin-bottom: 24px;
    }
    nz-card {
      margin-bottom: 24px;
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  }
} 