
import mysql from 'mysql';
import config from './config';
function connect(){
return mysql.createConnection(config.mysql);
}
/*
CREATE TABLE IF NOT EXISTS `user`(
    `user_id` INT UNSIGNED AUTO_INCREMENT,
    `qqid` VARCHAR(100) NOT NULL,
     `money` INT NULL,
    PRIMARY KEY ( `user_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
)
*/
export interface user{
    user_id:number;qqid:string;money:number;
    signData:string;
}
export default {
    mysql:{
        newUser(qqid:string,callback:()=>void,catc:(err:string)=>void):void{
            let connection=connect();
            connection.connect();
            let sql="INSERT INTO user (qqid,money,signData) VALUES ('"+qqid+"','0',date('2022-1-1'));";
            connection.query(sql,(err,res)=>{
                if(err){
                    console.error(err);
                    catc(err.message);
                    return;
                }
                callback();
            });
        },
        query(qqid:string,callback:(res:Array<user>)=>void,catc:(err:string)=>void):void{
            let connection=connect();
            connection.connect();
            let sql="select * from user where qqid='"+qqid+"';"
            connection.query(sql,(err,res)=>{
                if(err){
                    console.error(err);
                    catc(err.message);
                    return;
                }
                callback(JSON.parse(JSON.stringify(res)) as Array<user>);
            });
        },
        sign(qqid:string,callback:()=>void,catc:(err:string)=>void,money:number){
            let connection=connect();
            connection.connect();
            let sql="UPDATE user SET money='"+money+"',signData=NOW() where qqid='"+qqid+"';";
            connection.query(sql,(err,res)=>{
                if(err){
                    console.error(err);
                    catc(err.message);
                    return;
                }
                callback();
            })
        }
    }
}
