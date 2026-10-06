import type { RowDataPacket } from "mysql2";
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
        const response = await apiControllers.get("SELECT * FROM users");
        return response as UserEntity[];
    }

    public static create = async (userData: UserEntity): Promise<UserEntity> => {
        const { user, name, role, password } = userData;

        const rows = await apiControllers.execute<RowDataPacket[]>(
            "INSERT INTO users (user, name, role, password) VALUES (?, ?, ?, ?) RETURNING *",
            [user, name, role, password]
        );

        return rows[0] as UserEntity;
    }
}