import type { Request, Response } from "express";
import type { ApiPromise } from "../types/api-types";
import { UserModel } from "../models/users-model";

class UsersController {
    public getUsers = async (_: Request, res: Response): Promise<ApiPromise> => {
        try {
            const list = (await UserModel.get()).map(({ password, ...user }) => user);
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

    public addUser = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const { name, role, user, password } = req.body;
            const newUser = await UserModel.create({ name, role, user, password });
            const { password: _password, ...safeUser } = newUser;

            return res.status(201).json({
                ok: true,
                status: 201,
                msg: "Usuario creado exitosamente",
                res: safeUser
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

    public login = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const { user, password } = req.body;
            const found = await UserModel.authenticate(user, password);

            if (!found) {
                return res.status(401).json({
                    ok: false,
                    status: 401,
                    msg: "Credenciales incorrectas"
                });
            }

            const { password: _password, ...safeUser } = found;
            return res.status(200).json({
                ok: true,
                status: 200,
                msg: "Sesion iniciada exitosamente",
                res: safeUser
            });
        }
        catch (err: any) {
            console.log(`Error en login: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al iniciar sesion"
            })
        }
    }
}

export const usersController = new UsersController();
