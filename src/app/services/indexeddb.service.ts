import { Injectable, signal, Signal } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private _employees = signal<Employee[]>([]); // Reactive signal for employee data

  constructor() {
    this.initDB();
  }

  // Initialize IndexedDB
  private initDB() {
    const request = indexedDB.open('EmployeeDB', 1);

    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      if (!this.db?.objectStoreNames.contains('employees')) {
        this.db?.createObjectStore('employees', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadEmployees();
    };

    request.onerror = (event) => {
      console.error('Error initializing IndexedDB:', event);
    };
  }

  // Load all employees from IndexedDB
  private loadEmployees() {
    if (!this.db) return;

    const transaction = this.db.transaction('employees', 'readonly');
    const store = transaction.objectStore('employees');
    const request = store.getAll();

    request.onsuccess = (event: any) => {
      console.log('Employees loaded:', event.target.result);
      this._employees.set(event.target.result);
    };
    request.onerror = (event) => {
      console.error('Error loading employees:', event);
    };
  }

  // Getter for employees
  get employees() {
    return this._employees();
  }

  // Add new employee
  addEmployee(employee: Omit<Employee, 'id'>) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction('employees', 'readwrite');
    const store = transaction.objectStore('employees');
    const request = store.add({ ...employee });

    request.onsuccess = () => {
      console.log('Employee added successfully');
      this.loadEmployees(); // Refresh employee list after adding
    };

    request.onerror = (event) => {
      console.error('Add Employee Error:', event);
    };
  }

  // Update existing employee
  updateEmployee(employee: Employee) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction('employees', 'readwrite');
    const store = transaction.objectStore('employees');
    const request = store.put(employee);

    request.onsuccess = () => {
      console.log('Employee updated successfully');
      this.loadEmployees(); // Refresh employee list after update
    };

    request.onerror = (event) => {
      console.error('Update Employee Error:', event);
    };
  }

  // Delete an employee
  deleteEmployee(id: number) {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    const transaction = this.db.transaction('employees', 'readwrite');
    const store = transaction.objectStore('employees');
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('Employee deleted successfully');
      this.loadEmployees(); // Refresh employee list after deletion
    };

    request.onerror = (event) => {
      console.error('Delete Employee Error:', event);
    };
  }

  // Fetch employee by ID
  getEmployeeById(id: number): Promise<Employee | undefined> {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(undefined);
        return;
      }

      const transaction = this.db.transaction('employees', 'readonly');
      const store = transaction.objectStore('employees');
      const request = store.get(id);

      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = () => resolve(undefined);
    });
  }
}
