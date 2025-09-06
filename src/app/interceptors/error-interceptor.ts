import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toast: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let msg = '❌ Unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          msg = `⚠️ Client error: ${error.error.message}`;
        } else {
          msg = error.error?.message || `❌ Server error: ${error.status} ${error.statusText}`;
        }

        this.toast.show(msg, 'error');
        return throwError(() => error);
      })
    );
  }
}
