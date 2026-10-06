import mysql, { type QueryResult } from "mysql2/promise"

class ApiControllers {
    private pool;

    constructor() {
        this.pool = mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'tilines_db',
            enableKeepAlive: true,
            flags: ['-FOUND_ROWS']
        })
    }

    private getConnection = async () => {
        return this.pool.getConnection();
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