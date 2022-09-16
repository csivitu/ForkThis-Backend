import sharp from "sharp";

const resizePic = (req, res, next)=>{
    if(!req.files && !req.file) return next()

    const picPath = req.files['profilePic'][0].destination+'/'+req.files['profilePic'][0].filename;

    const promise = fs.promises.readFile(picPath);

    Promise.resolve(promise).then(function(buffer){
        sharp(buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 100})
    .toFile(`public/users/profilePic/${req.body.username}-${Date.now()}.jpeg`)

    });

    fs.unlinkSync(picPath, function(err){
        next(err)
    })

    req.body.profilePic = `${req.body.username}-${Date.now()}.jpeg`;
    
    next()
}

export default resizePic