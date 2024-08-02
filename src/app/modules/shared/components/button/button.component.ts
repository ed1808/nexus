import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button 
      [type]="btnType" 
      class="p-2 rounded shadow shadow-shark-600 dark:shadow-black transition-all ease-linear"
      [ngClass]="[colorSchema, btnWidth, displayBtn, btnFontWeight]"
      [title]="btnTitle"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() btnType: 'button' | 'submit' | 'reset' = 'button';
  @Input() color: 'primary' | 'danger' | 'warning' | 'transparent' = 'primary';
  @Input() width: 'full' | 'half' = 'full';
  @Input() display: 'block' | 'flex' | 'inline' = 'block';
  @Input() btnTitle: string = '';
  @Input() fontWeight: 'semibold' | 'normal' = 'normal';

  get btnWidth() {
    const size: { [key: string]: string } = {
      full: 'w-full',
      half: 'w-1/2'
    }

    return size[this.width];
  }

  get colorSchema() {
    const colors: { [key: string]: string } = {
      primary: 'bg-blue-500 text-pampas-50 hover:bg-blue-600 dark:bg-green-500 dark:hover:bg-green-600',
      danger: 'bg-orange-700 hover:bg-orange-800 text-pampas-50',
      warning: 'bg-yellow-400 text-shark-950 hover:bg-yellow-500',
      transparent: 'bg-transparent hover:bg-gray-300 dark:hover:bg-shark-700 shadow-none'
    }

    return colors[this.color];
  }

  get btnFontWeight() {
    const fontWeights: { [key: string]: string } = {
      semibold: 'font-semibold',
      normal: 'font-normal',
    }

    return fontWeights[this.fontWeight];
  }

  get displayBtn() {
    const btnDisplay: { [key: string]: string } = {
      block: 'block space-x-2',
      flex: 'flex items-center gap-1',
      inline: 'inline'
    }

    return btnDisplay[this.display];
  }
}
