import type { Request } from "express";
import type { ApiPromise } from "../types/api-types";
import { UserModel } from "../models/users-model";

class UsersController {
    public getUsers = async (_: Request, res: ApiPromise): Promise<ApiPromise> => {
        try {
            const list = await UserModel.get();
            return res.status(200).json({
                ok: true,
                status: 200,
                msg: "Usuarios obtenidos exitosamente",
                res: list
            });
        }
        catch (err: any) {
            console.log(`Error en getUsers: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al obtener usuarios"
            })
        }
    }

    public addUser = async (req: Request, res: ApiPromise): Promise<ApiPromise> => {
        try {
            const { name, role, user, password } = req.body;
            const newUser = await UserModel.create({ name, role, user, password });

            return res.status(201).json({
                ok: true,
                status: 201,
                msg: "Usuario creado exitosamente",
                res: newUser
            })
        }
        catch (err: any) {
            console.log(`Error en createUser: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al crear un usuario"
            })
        }
    }
}

export const usersController = new UsersController();