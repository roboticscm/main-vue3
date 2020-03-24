export class Language {
  constructor(public id: string = '', public name: string = '', public locale: string = '', public sort: number = 0) {}
  from(obj: any) {
    Object.assign(this, obj);
  }
}
