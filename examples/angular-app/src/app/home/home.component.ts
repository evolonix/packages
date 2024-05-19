import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

const columnClasses: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  items = Array.from({ length: 12 }).map((_, i) => `Item ${i + 1}`);
  gridStyle = `--items-per-row: ${3};`;

  itemClasses(index: number) {
    const columns = index % 5;
    return columnClasses[columns];
  }
}
