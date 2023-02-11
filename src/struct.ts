export type Class<T> = new(...args: any[]) => T;
type events<T>={
  [Property in keyof T]:Array<(event:T[Property])=>void>;
}
export class Tasks<T>{
  private events:events<T>=<any>{}
  public on<K extends keyof T>(key:K,on:(event:T[K])=>void){
    this.events[key].push(on);
  }
  public fire<K extends keyof T>(key:K,event:T[K]){
    for(let func of this.events[key]){
      func(event);
    }
  }
}