import multer from "multer";
import { storage } from "../utils/cloudinaryConfig.js";

const upload = multer({ storage });

export default upload;