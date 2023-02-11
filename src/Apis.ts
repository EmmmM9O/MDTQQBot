
import mysql from 'mysql';
import config from './config';
var connection = mysql.createConnection(config.mysql);
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
}
export default {
    mysql:{
        newUser(qqid:string):null|string{
            let sql="INSERT INTO user (qqid,money) VALUES ('"+qqid+"','0');";
            let re:null|string=null;
            connection.connect();
            connection.query(sql,(res,err)=>{
                if(err){
                    console.error(err);
                    re=err;
                }
            });
            return re;
        },
        query(qqid:string):Array<user>|string{
            let sql="select * from user where qqid='"+qqid+"';"
            connection.connect();
            let re:Array<user>|string='ee';
            connection.query(sql,(res,err)=>{
                if(err){
                    console.error(err);
                    re= err;
                }
                re= JSON.parse(JSON.stringify(res)) as Array<user>;
            });
            return re;
        }
    }
}