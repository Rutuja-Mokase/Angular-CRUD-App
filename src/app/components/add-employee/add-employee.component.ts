import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IndexedDBService } from '../../services/indexeddb.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  dateError: string | null = null;
  minToDate: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private db: IndexedDBService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  validateDates() {
    const fromDate = this.employeeForm.get('fromDate')?.value;
    const toDate = this.employeeForm.get('toDate')?.value;

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      this.dateError = 'To date cannot be before From date.';
    } else {
      this.dateError = null;
    }
  }

  onFromDateChange() {
    const fromDate = this.employeeForm.get('fromDate')?.value;
    if (fromDate) {
      this.minToDate = fromDate;
    }
    this.validateDates();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.db.addEmployee(this.employeeForm.value);
      this.router.navigate(['/employees']);
    }
  }
}
