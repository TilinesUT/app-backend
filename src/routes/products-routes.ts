import { Router } from "express"
import { productsControllers } from "../controllers/products-controllers";
import { createProductValidator, deleteProductValidator, updateProductValidator } from "../middlewares/products-middlewares";

const router = Router();

router.get("/", productsControllers.getProducts)
router.get("/categories", productsControllers.getCategories)
router.get("/:id", deleteProductValidator, productsControllers.findProduct)
router.post("/", createProductValidator, productsControllers.addProduct)
router.put("/", updateProductValidator, productsControllers.updateProduct)
router.delete("/:id", deleteProductValidator, productsControllers.deleteProduct)

export default router;