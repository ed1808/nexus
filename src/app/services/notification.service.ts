import { Injectable } from '@angular/core';
import { listen } from '@tauri-apps/api/event';
import { sendNotification, Options } from '@tauri-apps/api/notification';
import { CalendarEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    this.setupNotificationListener();
  }

  private async setupNotificationListener(): Promise<void> {
    await listen('notification', (event) => {
      const nextEvent = event.payload as CalendarEvent;
      this.showSystemNotification(nextEvent.title!);
    });
  }

  private showSystemNotification(message: string): void {
    const notificationOptions: Options = {
      title: 'Next calendar event',
      body: message,
      sound: 'Default',
    }

    sendNotification(notificationOptions);
  }
}
