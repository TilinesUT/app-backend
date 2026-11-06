import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { apiControllers } from "../controllers/api-controllers.js";

export interface ProductEntity {
    id: number,
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
    private static mapRow = (row: any): ProductEntity => {
        const rating = row.rating && typeof row.rating === 'object'
            ? row.rating
            : { rate: row.rating_rate, count: row.rating_count };

        return {
            id: row.id,
            title: row.title,
            category: row.category,
            description: row.description,
            image: row.image,
            price: Number(row.price),
            rating: {
                rate: Number(rating.rate ?? 0),
                count: Number(rating.count ?? 0)
            }
        };
    }

    public static get = async (): Promise<ProductEntity[]> => {
        const response = await apiControllers.get<RowDataPacket[]>("SELECT * FROM products");
        return response.map(ProductsModel.mapRow);
    }

    public static getById = async (productId: number): Promise<ProductEntity | undefined> => {
        const rows = await apiControllers.get<RowDataPacket[]>(
            "SELECT * FROM products WHERE id = ?",
            [productId]
        );
        const row = rows[0];

        if (!row) {
            return undefined
        }

        return ProductsModel.mapRow(row);
    }

    public static getCategories = async () => {
        const response = await apiControllers.get("SELECT DISTINCT category FROM products");
        return response.map((v: { category: string }) => v.category);
    }

    public static create = async (productData: Omit<ProductEntity, "id">): Promise<ProductEntity> => {
        const { category, description, image, price, rating, title } = productData;
        const result = await apiControllers.execute<ResultSetHeader>(
            `INSERT INTO products
                (title, category, description, image, price, rating_rate, rating_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, category, description, image, price, rating.rate, rating.count]
        );

        const product = await ProductsModel.getById(result.insertId);
        if (!product) {
            throw new Error("No se pudo recuperar el producto recien creado");
        }

        return product;
    }

    public static update = async (productData: Omit<ProductEntity, "id">, productId: number): Promise<ProductEntity | undefined> => {
        const { category, description, image, price, rating, title } = productData;
        await apiControllers.execute<ResultSetHeader>(
            `UPDATE products
                SET title = ?, category = ?, description = ?, image = ?, price = ?, rating_rate = ?, rating_count = ?
             WHERE id = ?`,
            [title, category, description, image, price, rating.rate, rating.count, productId]
        );

        return ProductsModel.getById(productId);
    }

    public static delete = async (productId: number): Promise<ProductEntity | undefined> => {
        const product = await ProductsModel.getById(productId);

        if (!product) {
            return undefined
        }

        await apiControllers.execute<ResultSetHeader>("DELETE FROM products WHERE id = ?", [productId]);
        return product;
    }
}
