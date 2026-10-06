import { body, param } from "express-validator";
import { validateFields } from "./global-middlewares";

export const createProductValidator = [
    body("title")
        .notEmpty().withMessage("El título es obligatorio")
        .isString().withMessage("El título tiene que ser una cadena de texto")
        .isLength({ min: 2, max: 70 }).withMessage("Ingrese un título valido entre 2 y 70 caracteres"),

    body("category")
        .notEmpty().withMessage("La categoría es obligatoria")
        .isString().withMessage("La categoría tiene que ser una cadena de texto")
        .isLength({ min: 2, max: 50 }).withMessage("Ingrese una categoría valida entre 2 y 50 caracteres"),

    body("description")
        .notEmpty().withMessage("La descripción es obligatoria")
        .isString().withMessage("La descripción tiene que ser una cadena de texto")
        .isLength({ min: 2, max: 100 }).withMessage("Ingrese una descripción valida entre 2 y 100 caracteres"),

    body("image")
        .notEmpty().withMessage("La imagen es obligatoria")
        .isString().withMessage("La imagen tiene que ser una cadena de texto")
        .isLength({ min: 5, max: 200 }).withMessage("Ingrese una URL de imagen valida entre 5 y 200 caracteres"),

    body("price")
        .notEmpty().withMessage("El precio es obligatorio")
        .isFloat({ min: 0 }).withMessage("Ingrese un precio valido mayor o igual a 0"),

    body("rating_rate")
        .optional({ nullable: true })
        .isInt({ min: 0, max: 5 }).withMessage("Ingrese una calificación valida entre 0 y 5"),

    body("rating_count")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("Ingrese un conteo de calificaciones valido mayor o igual a 0"),

    validateFields
];

export const updateProductValidator = [
    body("id")
        .notEmpty().withMessage("El ID del producto es obligatorio")
        .isInt({ min: 1 }).withMessage("Ingrese un ID de producto valido"),

    body("title")
        .optional()
        .isString().withMessage("El título tiene que ser una cadena de texto")
        .isLength({ min: 2, max: 70 }).withMessage("Ingrese un título valido entre 2 y 70 caracteres"),

    body("category")
        .optional()
        .isString().withMessage("La categoría tiene que ser una cadena de texto")
        .isLength({ min: 2, max: 50 }).withMessage("Ingrese una categoría valida entre 2 y 50 caracteres"),

    body("description")
        .optional()
        .isString().withMessage("La descripción tiene que ser una cadena de texto")
        .isLength({ min: 2, max: 100 }).withMessage("Ingrese una descripción valida entre 2 y 100 caracteres"),

    body("image")
        .optional()
        .isString().withMessage("La imagen tiene que ser una cadena de texto")
        .isLength({ min: 5, max: 200 }).withMessage("Ingrese una URL de imagen valida entre 5 y 200 caracteres"),

    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("Ingrese un precio valido mayor o igual a 0"),

    body("rating_rate")
        .isInt({ min: 0, max: 5 }).withMessage("Ingrese una calificación valida entre 0 y 5"),

    body("rating_count")
        .isInt({ min: 0 }).withMessage("Ingrese un conteo de calificaciones valido mayor o igual a 0"),

    validateFields
];

export const deleteProductValidator = [
    param("id")
        .notEmpty().withMessage("El ID del producto es obligatorio")
        .isInt({ min: 1 }).withMessage("Ingrese un ID de producto valido"),

    validateFields
]