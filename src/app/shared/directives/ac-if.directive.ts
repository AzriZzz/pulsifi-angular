import { Directive, Input, TemplateRef, ViewContainerRef, inject, signal, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

export interface AcIfContext {
  $implicit: boolean;
  acIf: boolean;
}

@Directive({
  selector: '[acIf]',
  standalone: true,
})
export class AcIfDirective {
  private readonly auth = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<AcIfContext>);
  private readonly viewContainer = inject(ViewContainerRef);

  private readonly hasPermission = signal<boolean>(false);
  private readonly context: AcIfContext = {
    $implicit: false,
    acIf: false,
  };

  constructor() {
    // Create an effect to handle view updates when permission changes
    effect(() => {
      const permitted = this.hasPermission();
      
      this.context.$implicit = this.context.acIf = permitted;
      this.viewContainer.clear();

      if (permitted) {
        this.viewContainer.createEmbeddedView(this.templateRef, this.context);
      }
    });
  }

  @Input()
  set acIf(permissions: string | string[]) {
    const permitted = Array.isArray(permissions)
      ? this.auth.hasAnyPermission(permissions)
      : this.auth.hasPermission(permissions);

    this.hasPermission.set(permitted);
  }

  static ngTemplateContextGuard(
    _dir: AcIfDirective,
    _ctx: unknown,
  ): _ctx is AcIfContext {
    return true;
  }
} 