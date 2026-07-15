import { Router } from "express";
import { UploadController } from "./upload.controller";
import { upload } from "../../common/middlewares/upload.middleware";

const router = Router();
const uploadController = new UploadController();

router.post("/", upload.single("image"), uploadController.uploadImage);

export default router;
