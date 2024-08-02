import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Note, NoteModalConfig } from '../../../../models/note.model';
import { NoteComponent } from '../../components/note/note.component';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NotesService } from '../../../../services/notes.service';
import { modalConfig } from '../../../../utils/modal.utils';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [ButtonComponent, NoteComponent, DialogModule],
  templateUrl: './notes-page.component.html'
})
export class NotesPageComponent {
  private notesService = inject(NotesService);

  notes: Note[] = []

  constructor(private dialog: Dialog) {}

  ngOnInit(): void {
    this._getNotes();
  }

  openNewNoteModal(): void {
    const noteModalConfig: NoteModalConfig = {
      entityType: 'note',
      mode: 'create',
      title: 'Add new note',
      entity: { content: '' }
    };

    const dialogRef = this.dialog.open<NoteModalConfig>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: noteModalConfig
    });

    dialogRef.closed.subscribe(result => {
      if (result !== undefined) {
        this._createNote(result.entity['content']);
        this._getNotes();
      }
    });
  }

  handleEditEvent(note: Note): void {
    const noteModalConfig: NoteModalConfig = {
      entityType: 'note',
      mode: 'edit',
      title: 'Edit note',
      entity: { content: note.content }
    };

    const dialogRef = this.dialog.open<NoteModalConfig>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: noteModalConfig
    });

    dialogRef.closed.subscribe(result => {
      if (result !== undefined) {
        this._updateNote(note.id!, result.entity['content']);
        this.notes = this.notes.map(arrayNote => {
          if (arrayNote.id === note.id) {
            return {
              ...arrayNote,
              content: result.entity['content']
            };
          }
          return arrayNote;
        })
      }
    })
  }

  handleDeleteEvent(noteId: string): void {
    const dialogRef = this.dialog.open<string>(ModalComponent, {
      minWidth: modalConfig.minWidth,
      width: modalConfig.width,
      maxWidth: modalConfig.maxWidth,
      data: {
        entityType: 'note',
        mode: 'delete',
        title: 'Delete note',
        entity: { content: '' }
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result !== undefined) {
        this._deleteNote(noteId);
        this.notes = this.notes.filter(note => note.id !== noteId);
      }
    })
  }

  private _getNotes(): void {
    this.notesService.getNotes()
      .then(result => {
        this.notes = result;
      })
      .catch(error => alert(error));
  }

  private _createNote(content: string): void {
    this.notesService.createNote(content);
  }

  private async _updateNote(id: string, newContent: string): Promise<void> {
    const result = await this.notesService.updateNote(id, newContent);
    console.log(result);
  }

  private async _deleteNote(id: string): Promise<void> {
    const result = await this.notesService.deleteNote(id);
    console.log(result);
  }
}
