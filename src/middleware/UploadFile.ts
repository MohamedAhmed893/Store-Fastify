
import multer,{StorageEngine} from "multer"
import { v4 as uuidv4 } from 'uuid';
import path = require("path");




let options =(folderName:string)=>{
    const storage:StorageEngine = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folderName}`)
        },
        filename: function (req, file, cb) {

            cb(null, uuidv4() + '-' + file.originalname)
        }
    })

        return multer({ storage  })
    }
 

// export const uploadFile = (fieldName:string, folderName:string) =>options(folderName).single(fieldName)