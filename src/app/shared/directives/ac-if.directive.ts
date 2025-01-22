import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
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

  private context: AcIfContext = {
    $implicit: false,
    acIf: false,
  };

  @Input()
  set acIf(permissions: string | string[]) {
    const hasPermission = Array.isArray(permissions)
      ? this.auth.hasAnyPermission(permissions)
      : this.auth.hasPermission(permissions);

    this.context.$implicit = this.context.acIf = hasPermission;
    this.viewContainer.clear();

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

  static ngTemplateContextGuard(
    _dir: AcIfDirective,
    _ctx: unknown,
  ): _ctx is AcIfContext {
    return true;
  }
} 