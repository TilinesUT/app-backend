import { Router } from "express"
import { usersController } from "../controllers/users-controllers";
import { createUserValidator } from "../middlewares/users-middlewares";

const router = Router();

router.get("/", usersController.getUsers)
router.post("/", createUserValidator, usersController.addUser)

export default router;