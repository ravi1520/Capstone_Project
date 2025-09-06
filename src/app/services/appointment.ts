import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Doctor model
export interface Doctor {
  id?: number;
  name: string;
  specialization: string;
  city: string;
  rating: number;
}

// ✅ Appointment model
export interface Appointment {
  id?: number;
  userId: number;
  doctorId: number;
//  date: string;
  timeSlot: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = 'http://localhost:5142/api';

  constructor(private http: HttpClient) {}

  // ===================== Appointments =====================
  book(appt: Appointment): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment/book`, appt);
  }

  cancel(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment/cancel/${id}`, {});
  }

  confirm(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment/confirm/${id}`, {});
  }

  listAppointments(city: string = '', date: string = ''): Observable<Appointment[]> {
    let url = `${this.baseUrl}/appointment/list`;
    if (city || date) url += `?city=${city}&date=${date}`;
    return this.http.get<Appointment[]>(url);
  }

  // ===================== Doctors =====================
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctor/all`);
  }

  addDoctor(doc: Doctor): Observable<any> {
    return this.http.post(`${this.baseUrl}/doctor/add`, doc);
  }

  updateDoctor(id: number, doc: Doctor): Observable<any> {
    return this.http.put(`${this.baseUrl}/doctor/update/${id}`, doc);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/doctor/delete/${id}`);
  }

  getDoctors(city: string, specialization: string, rating: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(
      `${this.baseUrl}/doctor/list?city=${city}&specialization=${specialization}&minRating=${rating}`
    );
  }

  getTimeSlots(doctorId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/doctor/timeslots/${doctorId}`);
  }
}
