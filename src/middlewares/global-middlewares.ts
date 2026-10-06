import type { NextFunction, Request } from "express";
import { validationResult } from "express-validator";
import type { ApiPromise } from "../types/api-types";

export const validateFields = (req: Request, res: ApiPromise, next: NextFunction): any => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const plainErrors = Object.fromEntries(
            Object.entries(errors.mapped()).map(([key, error]) => [key, error.msg])
        );

        return res.status(400).json({
            ok: false,
            status: 400,
            err: plainErrors
        });
    }

    next();
};