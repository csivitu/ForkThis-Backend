class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode=statusCode;
        this.status= `${statusCode}`.startsWith('4') ? "fail":"error";
        this.isOperationError = true;  //To check if the error is promted form this appError only and not some other programming error

        Error.captureStackTrace(this, this.constructor);  // to remove this class from the stack trace  
    }
}

export default AppError