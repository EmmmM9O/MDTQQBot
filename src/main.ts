
/// <reference path="../typings/index.d.ts" />
import config from './config';
import {createClient, GroupMessageEvent} from 'oicq';
import { Tasks} from './struct';
import * as CMD from './command'
const mainTask=new Tasks<{
  chatEvent:{
    msg:GroupMessageEvent
  }
}>();
console.info("QQBot start")

const client=createClient(config.qq)
if(config.asPassword){
client.on("system.login.slider", function (e) {
  console.log("输入ticket：")
  process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
}).login(config.password)
}else{
  client.on("system.login.qrcode", function (e) {
    process.stdin.once("data", () => {
      this.login()
    })
  }).login()
}
client.on('message.group', e => {
  mainTask.fire('chatEvent',{msg:e});
})

mainTask.on('chatEvent',e=>{
  try{
  CMD.run(e.msg)
}catch(e){
  console.error(e);
}
})
