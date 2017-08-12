import { HttpService } from '../../../../services/http.service';
import { IHttpReq } from '../../../../models/http-req';
import { ExerciseTypeService } from '../../../../services/exercise-type.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-exercise-type',
  templateUrl: './exercise-type.component.html',
  styleUrls: ['./exercise-type.component.scss']
})
export class ExerciseTypeComponent implements OnInit {

  focusedRowCode: number;

  displayedColumns = ['exerciseCode', 'typeName'];
  tableDatabase: TableDatabase;
  dataSource: ExampleDataSource | null;
  firstShow = true;
  wrongInput = false;
  addedTemporaryRow = false;
  loaded = false;


  constructor(private cd: ChangeDetectorRef, public exerciseTypeService: ExerciseTypeService) {
  }




  ngOnInit() {
    this.focusedRowCode = -1;
    this.tableDatabase = new TableDatabase();
    this.dataSource = new ExampleDataSource(this.tableDatabase);
    // This must have because material table have an issue when work with routes

    this.exerciseTypeService.getAllExerciseTypes((result: ExerciseApi.IExerciseType[]) => {
      this.loaded = this.tableDatabase.addRows(result) === 0 ? false : true;
      this.cd.markForCheck();
    });
  }


  clickRow(code: number) {
    this.focusedRowCode = code;
  }

  updateRow(code: number, body) {
    this.firstShow = false;
    if (body.name === '') {
      if (!code) {
        this.wrongInput = true;
      }
      this.focusedRowCode = -1;
      return;
    } else {
      if (!code) {
        this.wrongInput = false;
      }
    }
    if (code) {
      this.exerciseTypeService.updateExerciseTypeByCode(code, body, (data) => {
        this.loaded = this.tableDatabase.updateRow(code, body) === 0 ? false : true;
        this.cd.markForCheck();
      });
    } else {
      this.exerciseTypeService.addExerciseType(body.name, (data) => {
        this.loaded = this.tableDatabase.addRow(data.code, body.name) === 0 ? false : true;
        this.cd.markForCheck();
      });
      this.addedTemporaryRow = false;
    }
    this.focusedRowCode = -1;
  }



  deleteRow(code: number) {
    this.exerciseTypeService.deleteExerciseTypeByCode(code, (data) => {
      this.loaded = this.tableDatabase.deleteRow(code) === 0 ? false : true;
      this.cd.markForCheck();
    });
  }


  addRow() {
    if (this.wrongInput) {
      return;
    }
    this.wrongInput = true;
    this.firstShow = true;
    this.loaded = this.tableDatabase.addTemporaryRow() === 0 ? false : true;
    console.log(this.loaded);
    this.cd.markForCheck();
    this.addedTemporaryRow = true;
    setTimeout(() => {
      const elems: any = document.getElementsByClassName('input-focused');
      console.log(elems);
      elems[0].focus();
    });

  }

}






export class TableDatabase {
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }

  constructor() {
  }

  addRow(code: number, name: string) {
    let copiedData = [];
    if (this.data && this.data instanceof Array) {
      copiedData = this.data.slice(0, -1);
    }
    if (name === '') {
      return copiedData.length;
    }
    copiedData.push({
      code: code,
      name: name,
      isRemoved: false
    });
    this.dataChange.next(copiedData);
    return copiedData.length;
  }

  addTemporaryRow() {
    let copiedData = [];
    if (this.data && this.data instanceof Array) {
      copiedData = this.data.slice();
    }
    copiedData.push({
      code: null,
      name: '',
      isRemoved: false
    });
    this.dataChange.next(copiedData);
    return copiedData.length;
  }

  addRows(rows: ExerciseApi.IExerciseType[]) {
    if (!rows || !(rows instanceof Array) || !rows.length || (!rows[0].name && !rows[0].code && rows.length === 1)) {
      return 0;
    }
    this.dataChange.next(rows);
    return rows.length;
  }

  updateRow(code: number, body) {
    if (!this.data || !(this.data instanceof Array)) {
      return 0;
    }
    const copiedData = this.data.slice();
    if (body.name === '') {
      return copiedData.length;
    }
    copiedData.some(function (element) {
      if (element.code === code) {
        element = Object.assign(element, body);
        return true;
      }
      return false;
    });
    this.dataChange.next(copiedData);
    return copiedData.length;
  }


  deleteRow(code: number) {
    if (!this.data || !(this.data instanceof Array)) {
      return 0;
    }
    const copiedData = this.data.slice();
    let ind = copiedData.length;
    copiedData.some(function (element, index) {
      if (element.code === code) {
        ind = index;
        return true;
      }
      return false;
    });
    copiedData.splice(ind, 1);
    this.dataChange.next(copiedData);
    return copiedData.length;
  }
}




export class ExampleDataSource extends DataSource<ExerciseApi.IExerciseType> {
  constructor(private _tableDatabase: TableDatabase) {
    super();
  }

  connect(): Observable<ExerciseApi.IExerciseType[]> {
    return this._tableDatabase.dataChange;
  }

  disconnect() { }
}
