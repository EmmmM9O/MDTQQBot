import { GroupMessage } from "oicq";
import config from './config';
export class command{
  public name:string='none';
  public cmd:string='none';
  public decs:string='none';
  public run:(m:string,n:Array<string>
    ,msg:GroupMessage)=>void=()=>{};
}
interface _cms_{
  [index:string]:command|undefined;
}
var commands={} as _cms_;
export {commands}
export function run(msg:GroupMessage){
  let str=msg.message.toString();
  if(!str.startsWith(config.startWith)) return ;
  let com=str.substring(config.startWith.length).split(' ');
  let con=commands[com[0]];
  if(con==null) return ;
  con.run(str,com,msg);
}