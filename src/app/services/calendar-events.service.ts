import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { CalendarEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventsService {

  constructor() { }

  async getEvents(): Promise<CalendarEvent[]> {
    return await invoke<CalendarEvent[]>('get_events');
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    return await invoke<CalendarEvent>('get_event', { id });
  }

  async getLastEvent(): Promise<CalendarEvent> {
    const result = await invoke<CalendarEvent[]>('get_last_event');

    return result[0];
  }

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const newEvent = {
      title: event.title,
      description: event.description,
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
      finished: false,
    };

    return await invoke<CalendarEvent>('create_event', { eventData: newEvent });
  }

  async updateEvent(id: string, event: CalendarEvent): Promise<number> {
    return await invoke<number>('update_event', { id, event })
  }

  async deleteEvent(id: string): Promise<number> {
    return await invoke<number>('delete_event', { id });
  }
}
