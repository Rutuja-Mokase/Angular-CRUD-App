import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app';
  today = new Date();
  selectedFromDate: Date = new Date();
  selectedToDate: Date | null = null;
  calendarMonth: Date = new Date();
  disabledDates: Set<string> = new Set();

  ngOnInit() {
    this.updateDisabledDates();
  }

  // Update disabled dates for the ToDate calendar
  updateDisabledDates() {
    this.disabledDates.clear();
    if (this.selectedFromDate) {
      const fromDate = this.selectedFromDate.getDate();
      for (let day = 1; day < fromDate; day++) {
        this.disabledDates.add(day.toString());
      }
    }
  }

  // Change selected from-date
  selectFromDate(date: number) {
    this.selectedFromDate = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth(),
      date
    );
    this.selectedToDate = null; // Reset to-date
    this.updateDisabledDates();
  }

  // Change selected to-date
  selectToDate(date: number) {
    if (!this.disabledDates.has(date.toString())) {
      this.selectedToDate = new Date(
        this.calendarMonth.getFullYear(),
        this.calendarMonth.getMonth(),
        date
      );
    }
  }

  // Utility to check if date is today
  isToday(date: number): boolean {
    return (
      date === this.today.getDate() &&
      this.calendarMonth.getMonth() === this.today.getMonth() &&
      this.calendarMonth.getFullYear() === this.today.getFullYear()
    );
  }

  // Utility to check if a date is disabled
  isDisabled(date: number): boolean {
    return this.disabledDates.has(date.toString());
  }
}
