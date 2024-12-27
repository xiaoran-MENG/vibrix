import { Injectable } from '@angular/core';
import { ToastInfo } from './model/toast-info.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastInfo[] = [];
  
  constructor() { }
  
  add(body: string, type: 'SUCCESS' | 'DANGER') {
    this.toasts.push({ 
      body, 
      className: type === 'DANGER' 
      ? 'bg-danger text-light' 
      : 'bg-success text-light' 
    });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
