import "dotenv/config"
import mysql, { type Pool, type QueryResult } from "mysql2/promise"

class ApiControllers {
    private pool: Pool | null = null;

    private getPool = (): Pool => {
        if (this.pool === null) {
            this.pool = mysql.createPool({
                host: process.env['DB_HOST'] ?? '127.0.0.1',
                port: Number(process.env['DB_PORT'] ?? 4000),
                user: process.env['DB_USERNAME'] ?? '',
                password: process.env['DB_PASSWORD'] ?? '',
                database: process.env['DB_DATABASE'] ?? '',
                ssl: {},
                enableKeepAlive: true,
                flags: ['-FOUND_ROWS']
            })
        }
        return this.pool;
    }

    private getConnection = async () => {
        return await this.getPool().getConnection();
    }

    public get = async <T extends QueryResult = any>(query: string, values: any[] = []): Promise<T> => {
        let conn;
        try {
            conn = await this.getConnection();
            const response = values.length > 0
                ? await conn.execute<T>(query, values)
                : await conn.query<T>(query);
            return response[0];
        }
        catch (err) {
            throw err;
        }
        finally {
            if (conn) {
                conn.release()
            }
        }
    }

    public execute = async <T extends QueryResult>(query: string, values: any[]) => {
        let conn;
        try {
            conn = await this.getConnection();
            const response = await conn.execute<T>(query, values);
            return response[0];
        }
        catch (err) {
            throw err;
        }
        finally {
            if (conn) {
                conn.release()
            }
        }
    }
}

export const apiControllers = new ApiControllers()
