import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService,Doctor,Appointment } from '../../services/appointment';
import { NotificationService,NotificationMessage } from '../../services/notification';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  filterCity = '';
  filterDate = '';

  newDoctor: Doctor = {
    name: '',
    specialization: '',
    city: '',
    rating: 0
  };

  constructor(
    private apptService: AppointmentService,
    private notifService: NotificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.notifService.startConnection();
    this.notifService.onNotification((n: NotificationMessage) => {
      this.toast.show(`📩 ${n.message}`, 'info');
    });
    this.loadDoctors();
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.notifService.stopConnection();
  }

  loadDoctors(): void {
    this.apptService.getAllDoctors().subscribe({
      next: (res: Doctor[]) => (this.doctors = res),
      error: () => this.toast.show('❌ Failed to load doctors', 'error')
    });
  }

  addDoctor(): void {
    this.apptService.addDoctor(this.newDoctor).subscribe({
      next: () => {
        this.toast.show('✅ Doctor added', 'success');
        this.loadDoctors();
        this.newDoctor = { name: '', specialization: '', city: '', rating: 0 };
      },
      error: () => this.toast.show('❌ Failed to add doctor', 'error')
    });
  }

  updateDoctor(doc: Doctor): void {
    if (!doc.id) return;
    this.apptService.updateDoctor(doc.id, doc).subscribe({
      next: () => this.toast.show('✅ Doctor updated', 'success'),
      error: () => this.toast.show('❌ Failed to update doctor', 'error')
    });
  }

  deleteDoctor(id: number): void {
    this.apptService.deleteDoctor(id).subscribe({
      next: () => {
        this.toast.show('🗑 Doctor deleted', 'warning');
        this.loadDoctors();
      },
      error: () => this.toast.show('❌ Delete failed', 'error')
    });
  }

  loadAppointments(): void {
    this.apptService.listAppointments(this.filterCity, this.filterDate).subscribe({
      next: (res: Appointment[]) => (this.appointments = res),
      error: () => this.toast.show('❌ Failed to load appointments', 'error')
    });
  }

  confirm(id: number): void {
    this.apptService.confirm(id).subscribe({
      next: (res: any) => {
        this.toast.show(res.message || '✅ Appointment confirmed', 'success');
        this.loadAppointments();
      },
      error: () => this.toast.show('❌ Confirm failed', 'error')
    });
  }

  cancel(id: number): void {
    this.apptService.cancel(id).subscribe({
      next: (res: any) => {
        this.toast.show(res.message || '⚠️ Appointment cancelled', 'warning');
        this.loadAppointments();
      },
      error: () => this.toast.show('❌ Cancel failed', 'error')
    });
  }
}
