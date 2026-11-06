import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { apiControllers } from "../controllers/api-controllers";

export interface UserEntity {
    id?: number,
    name: string,
    user: string,
    role: "ADMIN" | "AUDITOR" | "CLIENT",
    password: string
}

export class UserModel {
    public static get = async (): Promise<UserEntity[]> => {
        const response = await apiControllers.get<RowDataPacket[]>("SELECT * FROM users");
        return response as UserEntity[];
    }

    public static getById = async (userId: number): Promise<UserEntity | undefined> => {
        const rows = await apiControllers.get<RowDataPacket[]>(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );

        return rows[0] as UserEntity | undefined;
    }

    public static authenticate = async (user: string, password: string): Promise<UserEntity | undefined> => {
        const rows = await apiControllers.get<RowDataPacket[]>(
            "SELECT * FROM users WHERE `user` = ? AND password = ? LIMIT 1",
            [user, password]
        );

        return rows[0] as UserEntity | undefined;
    }

    public static create = async (userData: Omit<UserEntity, "id">): Promise<UserEntity> => {
        const { user, name, role, password } = userData;

        const result = await apiControllers.execute<ResultSetHeader>(
            "INSERT INTO users (user, name, role, password) VALUES (?, ?, ?, ?)",
            [user, name, role, password]
        );

        const created = await UserModel.getById(result.insertId);
        if (!created) {
            throw new Error("No se pudo recuperar el usuario recien creado");
        }

        return created;
    }
}
