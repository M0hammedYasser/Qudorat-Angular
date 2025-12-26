import { Component, OnInit } from '@angular/core';
import { TestManager } from "../../../../../model/test-manager";
import { TestManagerService } from "../../../../../service/test-manager/test-manager.service";
import { CurrencyPipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-test-manger',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './test-manger.component.html',
  styleUrl: './test-manger.component.css'
})
export class TestMangerComponent implements OnInit {

  tests: TestManager[] = [];
  testName: string = '';
  testPrice: number | null = null;
  editIndex: number | null = null;
  editTestName: string = '';
  editTestPrice: number | null = null;

  constructor(private service: TestManagerService) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe({
      next: (res) => {
        this.tests = res;
      },
      error: (err) => {
        console.error('Error loading tests:', err);
      }
    });
  }

  insert() {
    if (!this.testName || this.testPrice == null) return;

    const newTest: TestManager = { id: 0, name: this.testName, price: this.testPrice };
    this.service.insert(newTest).subscribe({
      next: (test) => {
        this.tests.push(test);
        this.testName = '';
        this.testPrice = null;
      },
      error: (err) => {
        console.error('Error adding test:', err);
      }
    });
  }

  startEdit(index: number) {
    this.editIndex = index;
    this.editTestName = this.tests[index].name;
    this.editTestPrice = this.tests[index].price;
  }

  update(index: number) {
    if (this.editTestName === '' || this.editTestPrice == null) return;

    const test = this.tests[index];
    const updatedTest: TestManager = { ...test, name: this.editTestName, price: this.editTestPrice };

    this.service.update(updatedTest, updatedTest.id).subscribe({
      next: () => {
        this.tests[index] = updatedTest;
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Error updating test:', err);
      }
    });
  }

  remove(index: number) {
    const test = this.tests[index];
    this.service.delete(test.id).subscribe({
      next: () => {
        this.tests.splice(index, 1);
      },
      error: (err) => {
        console.error('Error deleting test:', err);
      }
    });
  }

  cancelEdit() {
    this.editIndex = null;
    this.editTestName = '';
    this.editTestPrice = null;
  }


}
