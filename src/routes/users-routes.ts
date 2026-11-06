import { Router } from "express"
import { usersController } from "../controllers/users-controllers.js";
import { createUserValidator, loginUserValidator } from "../middlewares/users-middlewares.js";

const router = Router();

router.post("/login", loginUserValidator, usersController.login)
router.get("/", usersController.getUsers)
router.post("/", createUserValidator, usersController.addUser)

export default router;
