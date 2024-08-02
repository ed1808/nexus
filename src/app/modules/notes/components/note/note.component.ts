import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../../../models/note.model';
import { OverlayModule } from '@angular/cdk/overlay';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [OverlayModule, ButtonComponent],
  templateUrl: './note.component.html'
})
export class NoteComponent {
  isOpen: boolean = false;

  @Input({ required: true }) note!: Note;

  @Output() editNoteEvent = new EventEmitter<Note>();
  @Output() deleteNoteEvent = new EventEmitter<string>();

  editNote() {
    this.editNoteEvent.emit({
      id: this.note.id,
      content: this.note.content
    });
  }

  deleteNote() {
    this.deleteNoteEvent.emit(this.note.id);
  }
}
