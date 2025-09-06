import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

export interface NotificationMessage {
  email: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  // ✅ Start SignalR connection
  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5142/notificationHub') // backend hub
      .build();

    this.hubConnection.start().catch(err => console.error('SignalR Error: ', err));
  }

  // ✅ Listen for messages
  onNotification(callback: (notification: NotificationMessage) => void): void {
    this.hubConnection.on('ReceiveNotification', (email, message) => {
      callback({ email, message });
    });
  }

  // ✅ Stop connection when leaving page
  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
