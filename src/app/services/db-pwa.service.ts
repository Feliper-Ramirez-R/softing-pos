import { Injectable } from '@angular/core';
import Dexie from 'dexie';
// import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DbPwaService extends Dexie {

  //  private notifications:any[]=[];

  // private componentMethodCallSource = new BehaviorSubject<any>(null);

  // componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor() {
    super('DBFacturas');
    this.version(1).stores({
      notes: '++id'
    });
    // this.getNotes()
  }

  async addNote(fac:any) {
    this.table('notes').add(fac);
    // const notis = await this.getNotes()
    // this.componentMethodCallSource.next(notis);
    
  }

  async getNotes() {
    const notes = await this.table('notes').toArray();
    // ordena por status primero los sin leer y luego los leidos
    // notes.sort((a: any, b: any) => a.status - b.status);
    return notes
  }

   deleteNote(id: number) {
    return this.table('notes').delete(id);
     
  }

   deleteAlls() {
    return this.table('notes').clear();
     
  }

  updateNote(id: number, item: any) {
    return this.table('notes').update(id, item);
  }
  


}
