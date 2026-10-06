import { body } from "express-validator";
import { validateFields } from "./global-middlewares";

export const createUserValidator = [
    body("user")
        .notEmpty().withMessage("El usuario es obligatorio")
        .isLength({ min: 2, max: 30 }).withMessage("Ingrese un usuario valido entre 2 y 30 caracteres"),

    body("name")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre tiene que ser una cadena de texto")
        .isLength({ min: 2, max: 50 }).withMessage("Ingrese un nombre valido entre 2 y 50 caracteres"),

    body("role")
        .notEmpty().withMessage("El rol es obligatorio")
        .isString().withMessage("El rol tiene que ser una cadena de texto")
        .isIn(["ADMIN","AUDITOR","CLIENT"]).withMessage("Ingrese un rol valido (ADMIN, AUDITOR, CLIENT)"),

    body("password")
        .notEmpty().withMessage("La contraseña es obligatorio")
        .isLength({ min: 2, max: 50 }).withMessage("Ingrese una contraseña valida entre 2 y 50 caracteres"),

    validateFields
]