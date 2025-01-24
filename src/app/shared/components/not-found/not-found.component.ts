import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzResultModule,
    NzButtonModule
  ],
  template: `
    <div class="not-found-container">
      <nz-result
        nzStatus="404"
        nzTitle="404"
        nzSubTitle="Sorry, the page you visited does not exist."
      >
        <div nz-result-extra>
          <button nz-button nzType="primary" routerLink="/">Back Home</button>
        </div>
      </nz-result>
    </div>
  `,
  styles: [`
    .not-found-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f0f2f5;
    }
  `]
})
export class NotFoundComponent {} 