import type { RowDataPacket } from "mysql2";
import { apiControllers } from "../controllers/api-controllers";

export interface ProductEntity {
    id?: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating: {
        rate: number,
        count: number
    }
}

export class ProductsModel {
    public static get = async (): Promise<ProductEntity[]> => {
        const response = await apiControllers.get("SELECT * FROM products");
        return response as ProductEntity[];
    }

    public static getById = async (productId: number): Promise<ProductEntity | undefined> => {
        const rows = await apiControllers.get("SELECT * FROM products WHERE id = ?", [productId]);
        const row = rows[0] as any;

        if (!row) {
            return undefined
        }
    
        return {
            id: row.id,
            title: row.title,
            category: row.category,
            description: row.description,
            image: row.image,
            price: row.price,
            rating: {
                rate: row.rating_rate,
                count: row.rating_count
            }
        }; 
    }

    public static getCategories = async () => {
        const response = await apiControllers.get("SELECT DISTINCT category FROM products");
        return response.map((v: {category: string}) => v.category);
    }

    public static create = async (productData: ProductEntity): Promise<ProductEntity> => {
        const { category, description, image, price, rating, title } = productData;
        const rows = await apiControllers.execute<RowDataPacket[]>(
            `INSERT INTO products
                (title, category, description, image, price, rating_rate, rating_count)
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
            [title, category, description, image, price, rating.rate, rating.count]
        );

        const row = rows[0] as any;
        const product = {
            ...row,
            rating: {
                rate: row.rating_rate,
                count: row.rating_count
            }
        }

        return product as ProductEntity;
    }

    public static update = async (productData: Omit<ProductEntity, "id">, productId: number): Promise<ProductEntity> => {
        const { category, description, image, price, rating, title } = productData;
        const result = await apiControllers.execute<RowDataPacket[]>(
            `UPDATE products SET title = ?, category = ?, description = ?, image = ?, price = ?, rating_rate = ?, rating_count = ? WHERE id = ? RETURNING *`,
            [title, category, description, image, price, rating.rate, rating.count, productId]
        );

        const rows = Array.isArray(result[0]) ? result[0] : result;
        let row = rows[0];

        if (!row) {
            const existing = await apiControllers.get<RowDataPacket[]>(
                `SELECT * FROM products WHERE id = ?`,
                [productId]
            );
            row = Array.isArray(existing) ? existing[0] : undefined;
        }

        if (!row) {
            return undefined as unknown as ProductEntity;
        }

        return {
            id: row.id,
            title: row.title,
            category: row.category,
            description: row.description,
            image: row.image,
            price: row.price,
            rating: {
                rate: row.rating_rate,
                count: row.rating_count
            }
        };
    }

    public static delete = async (productId: number): Promise<ProductEntity | undefined> => {
        const rows = await apiControllers.execute<RowDataPacket[]>("DELETE FROM products WHERE id = ? RETURNING *", [productId]);
        const row = rows[0] as any;

        if (!row) {
            return undefined
        }
    
        return {
            id: row.id,
            title: row.title,
            category: row.category,
            description: row.description,
            image: row.image,
            price: row.price,
            rating: {
                rate: row.rating_rate,
                count: row.rating_count
            }
        };        
    }
}