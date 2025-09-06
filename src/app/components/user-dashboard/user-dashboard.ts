import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService, Doctor } from '../../services/appointment';
import { NotificationService, NotificationMessage } from '../../services/notification';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  city = '';
  specialization = '';
  date = '';
  minRating = 0;

  doctors: Doctor[] = [];
  timeSlots: string[] = [];
  selectedDoctorId: number | null = null;
  appointments: any[] = []; // ✅ store booked appointments

  constructor(
    private apptService: AppointmentService,
    private notifService: NotificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.notifService.startConnection();
    this.notifService.onNotification((n: NotificationMessage) => {
      this.toast.show(`📢 ${n.message}`, 'info');
    });

    // ✅ load appointments initially
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.notifService.stopConnection();
  }

  // ================= Doctors =================
  // findDoctors(): void {
  //   this.apptService.getDoctors(this.city, this.specialization, this.date, this.minRating).subscribe({
  //     next: (res: Doctor[]) => (this.doctors = res),
  //     error: () => this.toast.show('❌ Failed to load doctors', 'error')
  //   });
  // }
  findDoctors(): void {
  this.apptService.getDoctors(this.city, this.specialization, this.minRating).subscribe({
    next: (res: Doctor[]) => (this.doctors = res),
    error: () => this.toast.show('❌ Failed to load doctors', 'error')
  });
}


  selectDoctor(doctorId: number): void {
    this.selectedDoctorId = doctorId;
    this.apptService.getTimeSlots(doctorId).subscribe({
      next: (slots: string[]) => (this.timeSlots = slots),
      error: () => this.toast.show('❌ Failed to load slots', 'error')
    });
  }

  // ================= Appointments =================
  loadAppointments(): void {
    this.apptService.listAppointments(this.city, this.date).subscribe({
      next: (res: any[]) => (this.appointments = res),
      error: () => this.toast.show('❌ Failed to load appointments', 'error')
    });
  }

  book(slot: string): void {
    if (!this.selectedDoctorId) return;
    this.apptService.book({
      userId: 1, // ⚠️ Replace with logged-in user ID later
      doctorId: this.selectedDoctorId,
     // date: this.date,
      timeSlot: slot
    }).subscribe({
      next: (res: any) => {
        this.toast.show(res.message || '✅ Appointment booked', 'success');
        this.loadAppointments(); // reload list
      },
      error: () => this.toast.show('❌ Booking failed', 'error')
    });
  }
  

  cancel(id: number): void {
    this.apptService.cancel(id).subscribe({
      next: (res: any) => {
        this.toast.show(res.message || '⚠️ Appointment cancelled', 'warning');
        this.loadAppointments(); // reload list
      },
      error: () => this.toast.show('❌ Cancel failed', 'error')
    });
  }
}
