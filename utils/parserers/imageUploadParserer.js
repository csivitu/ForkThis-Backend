import multer from "multer";
import multerFilter from "../multerConfigs/multerFilter.js";
import multerDiskStorage from "../multerConfigs/multerDiskStorage.js";

const upload = multer({
    fileFilter: multerFilter,
    storage:multerDiskStorage("user"),
    limits:{fileSize:5*1024*1024}
    });

const imageUploadParserer= upload.single('profilePic')

export default imageUploadParserer;