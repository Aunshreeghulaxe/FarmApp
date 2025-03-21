import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *",function() {
    https.get(process.env.API_URL,(res)=>{
        if(res.statusCode===200) console.log("GET request sent successfully");
        else console.log("Get request failed",res.statusCode);
    })
    .on("error",(e)=>console.error("Error while sending request",e));
})

export default job;

//Corn Job Explanation
//corn jobs are sceduled tasks that run perioadically at fixed intervals
//we want to send 1 Get request foe every 14 minutes

//how to define a "Schedule"?
//you difine a schedule using a can expression.which consits of five fields representing:

//!Minute,hour,day of the month,day of the weel