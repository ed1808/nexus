import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CalendarEvent } from '../../../../models/event.model';
import { DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { EventDetailComponent } from '../event-detail/event-detail.component';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { modalConfig } from '../../../../utils/modal.utils';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [DatePipe, NgClass, DialogModule],
  templateUrl: './day-view.component.html'
})
export class DayViewComponent {
  @Input({ required: true }) events!: CalendarEvent[];
  @Input({ required: true }) date!: Date;

  @Output() refreshEvents = new EventEmitter<boolean>();
  
  @ViewChild('timeline') timeline!: ElementRef<HTMLDivElement>;

  hoursArray: number[] = [];

  currentHour!: number;

  constructor(private dialog: Dialog) {
    for (let i = 0; i < 24; i++) {
      this.hoursArray.push(i);
    }
  }

  ngOnInit(): void {
    this.currentHour = this.date.getHours();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const event = changes['events'];

    if (event !== undefined && !event.isFirstChange()) {
      this.currentHour = this.date.getHours();
      this.setTimeline();
    }
  }

  ngAfterViewInit(): void {
    this.setTimeline();
  }

  getEventTopPosition(event: CalendarEvent): string {
    const startDateTime = new Date(event.start_datetime!);
    const startMinutes = startDateTime.getMinutes();

    return `${startMinutes}px`;
  }

  getEventHeight(event: CalendarEvent): string {
    const startDateTime = new Date(event.start_datetime!);
    const endDateTime = new Date(event.end_datetime!);

    const duration = (endDateTime.getTime() - startDateTime.getTime()) / 60000;

    return `${duration / 60 * 60}px`;
  }

  isEventHour(event: CalendarEvent, hour: number): boolean {
    const startHour = new Date(event.start_datetime!).getHours();

    return hour === startHour;
  }

  setTimeline(): void {
    const scrollCurrentPosition = this.timeline.nativeElement.scrollTop;
    const hour = this.date.getHours();

    let scrollPosition = 0;

    if (hour > 16 && scrollCurrentPosition < this.timeline.nativeElement.scrollHeight) {
      scrollPosition = this.timeline.nativeElement.scrollHeight;
    } else if (hour < 17) {
      const minutes = this.date.getMinutes();
      scrollPosition = (hour * 60) + minutes;
    } else {
      scrollPosition = scrollCurrentPosition;
    }

    this.timeline.nativeElement.scrollTop = scrollPosition;
  }

  showEventDetail(eventData: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDetailComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: eventData
    });

    dialogRef.closed.subscribe(result => {
      this.refreshEvents.emit(true);
    });
  }

  ngOnDestroy(): void {
    this.events = [];
  }
}
