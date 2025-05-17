import multer from "multer";
import { storage } from "../utils/cloudinaryConfig";

const upload = multer({ storage });

export default upload;