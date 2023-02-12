/// <reference path="../typings/index.d.ts" />
import {GroupMessageEvent } from "oicq";
import config from './config';
import Apis, { user } from "./Apis";
import { isDate } from "util";
export class command{
  public name:string='none';
  public addon:string='none';
  public decs:string='none';
  public run:(m:string,n:Array<string>
    ,msg:GroupMessageEvent)=>void=()=>{};
  public constructor(name:string
    ,decs:string,addon:string,
    run:(m:string,n:Array<string>,msg:GroupMessageEvent)=>void
      ){
        this.name=name;this.addon=addon;
        this.run=run;this.decs=decs;
      }
}
export class moneyCommand extends command{
  public constructor(name:string
        ,decs:string,addon:string,
    run:(m:string,n:Array<string>,msg:GroupMessageEvent,user:user)=>void
    ){
      super(name,decs,addon,
        (m,n,msg)=>{
          let from=msg.member['user_id'];
          Apis.mysql.query(from.toString()
          ,(res)=>{
            if(res.length<=0){
              Apis.mysql.newUser(from.toString(),()=>{
                Apis.mysql.query(from.toString(),(res)=>{
                  run(m,n,msg,res[0]);
                },(err)=>{
                  msg.reply("错误!"+err,true);
                })
              },(err)=>{
                msg.reply("错误!"+err,true);
              })
            }else{
              run(m,n,msg,res[0]);
            }
          },(err)=>{
            msg.reply("错误！"+err,true);
          })
    });
}
}

var commands=new Map<string,command>()
export {commands}
export function run(msg:GroupMessageEvent){
  let str=msg.toString();
  if(!str.startsWith(config.startWith)) return ;
  let com=str.substring(config.startWith.length).split(' ');
  if(!commands.has(com[0])) return;
  let con=commands.get(com[0]);
  if(con==null) return;
  con.run(str,com,msg);
}
commands.set("帮助",new command(
  "帮助","显示所有指令","[page]",
  (m,n,msg)=>{
    let page=Number(n[1]);
    if(page==null||isNaN(page)){
      page=1;
    }
    if(page<=0
      ||page>Math.ceil(commands.size*1.0/8)){
        msg.reply("无效页码",true);
        return;
    }
    let str="----帮助----\n";
    let vs=[] as Array<command>;
    for(let v of commands.values()){
      vs.push(v);
    }
    for(let i=(page-1)*8;i<page*8;i++){
      let com=vs[i];
      if(com==null) continue;
      str+=com.name+":"+com.addon+"\n简介:"
      +com.decs+"\n";
    }
    str+="---"+page+"/"+Math.ceil(commands.size*1.0/8);
    msg.reply(str);
  }
));
commands.set("测试",new command(
  "测试","只是测试","",
  (m,n,msg)=>{
    msg.reply("只是测试",true);
  }
));
commands.set("个人信息",new moneyCommand(
  "个人信息","显示个人信息","",
  (m,n,msg,user)=>{
    msg.reply("用户"+user.user_id
    +'\nQQ:'+user.qqid+'\n余额'+user.money,true);
  }
))
commands.set("签到",new moneyCommand(
  "签到","签到","",
  (m,n,msg,user)=>{
    let date=new Date(Date.parse(user.signData.replace(/-/g,   "/").split("T")[0]));
    let k=new Date().getTime()-date.getTime();
    let day=1000*60*60*24;
    console.log(user.signData+'$$$'+date+"$$$"+k);
    if(k<day*2){
      msg.reply("你已经签到过了 还有"+(day*2-k)/1000/60/60+"小时");
      return;
    }
    let rand=Math.floor(Math.random()*100+50);
    Apis.mysql.sign(user.qqid,()=>{
      msg.reply("签到成功"+rand,true);
    },err=>{
      msg.reply("错误!"+err,true);
    },rand+user.money);
  }
))

