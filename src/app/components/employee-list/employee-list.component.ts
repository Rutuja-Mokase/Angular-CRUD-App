import { Component } from '@angular/core';
import { IndexedDBService } from '../../services/indexeddb.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
  constructor(public db: IndexedDBService) {}
  deleteEmployee(id: number) {
    this.db.deleteEmployee(id);
  }
}
