import { Router } from "express";
import {productController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/",productController.getAll);
router.get("/mockingproducts",productController.getMockingProducts);
router.get("/:pid",productController.getById);
router.post("/",productController.addProduct);
router.delete("/:pid",productController.deleteProduct);
router.put("/:pid",productController.updateProduct);


export default router;