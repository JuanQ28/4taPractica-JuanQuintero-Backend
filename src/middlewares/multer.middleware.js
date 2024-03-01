import multer from 'multer'
import {__dirname} from '../tools.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname === "product"){
            return cb(null, `${__dirname}/multerDocs/product`)
        } else if(file.fieldname === "personID"){
            return cb(null, `${__dirname}/multerDocs/document`)
        } else if(file.fieldname === "adress"){
            return cb(null, `${__dirname}/multerDocs/document`)
        } else if(file.fieldname === "accountStatus"){
            return cb(null, `${__dirname}/multerDocs/document`)
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split("/")[1]}`)
    }
})

const upload = multer({ storage: storage })

export default upload