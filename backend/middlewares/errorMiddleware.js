const notFound= (req,res,next) =>{
    const error =new Error(`Not Found -${req.OriginalUrl}`)
    res.status(404);
    next(error)
}
const errorHandler=(err,req,res,next)=>{
    const statusCode = res.statusCode ===200 ?500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: `Not Found - ${req.originalUrl}`,
        stack: process.env.NODE_ENV ==="development" ? null :err.stack,
    })
};

module.exports= { notFound, errorHandler }