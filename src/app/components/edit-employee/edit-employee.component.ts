import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDBService } from '../../services/indexeddb.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeData: Employee | undefined;
  dateError: string | null = null;
  minToDate: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private db: IndexedDBService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.db.getEmployeeById(Number(employeeId)).then((employee) => {
        if (employee) {
          this.employeeData = employee;
          this.employeeForm.patchValue({
            name: this.employeeData.name,
            role: this.employeeData.role,
            fromDate: this.employeeData.fromDate,
            toDate: this.employeeData.toDate,
          });
          this.minToDate = this.employeeData.fromDate;
        }
      });
    }
  }

  onFromDateChange() {
    const fromDate = this.employeeForm.get('fromDate')?.value;
    if (fromDate) {
      this.minToDate = fromDate;
      this.validateDates();
    }
  }

  validateDates() {
    const fromDate = this.employeeForm.get('fromDate')?.value;
    const toDate = this.employeeForm.get('toDate')?.value;
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      this.dateError = 'To date cannot be before From date.';
    } else {
      this.dateError = null;
    }
  }

  onSubmit() {
    if (this.employeeForm.valid && this.employeeData) {
      const updatedEmployee: Employee = {
        ...this.employeeData,
        ...this.employeeForm.value,
      };
      this.db.updateEmployee(updatedEmployee);
      this.router.navigate(['/employees']);
    }
  }

  onDeleteEmployee() {
    if (
      this.employeeData &&
      confirm('Are you sure you want to delete this employee?')
    ) {
      this.db.deleteEmployee(this.employeeData.id);
      this.router.navigate(['/employees']);
    }
  }
}
