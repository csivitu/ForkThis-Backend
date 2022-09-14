
export const uncaughtExceptionManager = process.on('uncaughtException', err=>{
    console.log(err);
    console.log("Uncaught Exception! Shutting Down the App....");
    process.exit(1);
});

export const unhandledRejectionManager = process.on('unhandledRejection', err=>{ 
    console.log(err);
    console.log("Unhandled Rejection! Shutting Down the App....");
    server.close(()=>{
        process.exit(1);
    });
});
