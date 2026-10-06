import type { Request, Response } from "express";
import type { ApiPromise } from "../types/api-types";
import { ProductsModel } from "../models/products-model";

class ProductsControllers {
    public getProducts = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const list = await ProductsModel.get();
            return res.status(200).json({
                ok: true,
                status: 200,
                res: list
            });
        }
        catch (err: any) {
            console.log(`Error en getProducts: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al obtener productos"
            })
        }
    }

    public addProduct = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const { title, price, description, category, image, rating_rate, rating_count } = req.body;
            const newProduct = await ProductsModel.create({
                title, price, description, category, image, rating: { rate: rating_rate, count: rating_count }
            });

            return res.status(201).json({
                ok: true,
                status: 201,
                res: newProduct
            });
        }
        catch (err: any) {
            console.log(`Error en addProduct: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al crear un producto"
            })
        }
    }

    public updateProduct = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const { id, title, price, description, category, image, rating_rate, rating_count } = req.body;
            const newProduct = await ProductsModel.update(
                { title, price, description, category, image, rating: { rate: rating_rate, count: rating_count } },
                id
            );

            if (newProduct == undefined) {
                return res.status(404).json({
                    ok: false,
                    status: 404,
                    msg: `Producto con ID ${id} no encontrado`
                });
            }

            return res.status(200).json({
                ok: true,
                status: 200,
                res: newProduct
            });
        }
        catch (err: any) {
            console.log(`Error en updateProduct: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al actualizar un producto"
            })
        }
    }

    public deleteProduct = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const { id } = req.params;
            const product = await ProductsModel.delete(Number(id));

            if (product == undefined) {
                return res.status(404).json({
                    ok: false,
                    status: 404,
                    msg: `Producto con ID ${id} no encontrado`
                });
            }

            return res.status(200).json({
                ok: true,
                status: 200,
                msg: "Producto eliminado exitosamente",
                res: product
            });
        }
        catch (err: any) {
            console.log(`Error en deleteProduct: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al eliminar un producto"
            })
        }
    }

    public findProduct = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const { id } = req.params;
            const product = await ProductsModel.getById(Number(id));

            if (product == undefined) {
                return res.status(404).json({
                    ok: false,
                    status: 404,
                    msg: `Producto con ID ${id} no encontrado`
                });
            }

            return res.status(200).json({
                ok: true,
                status: 200,
                msg: product
            });
        }
        catch (err: any) {
            console.log(`Error en findProduct: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al buscar un producto"
            })
        }
    }

    public getCategories = async (req: Request, res: Response): Promise<ApiPromise> => {
        try {
            const categories = await ProductsModel.getCategories();

            return res.status(200).json({
                ok: true,
                status: 200,
                res: categories
            });
        }
        catch (err: any) {
            console.log(`Error en findProduct: ${err.message}`);
            return res.status(500).json({
                ok: false,
                status: 500,
                msg: "Error interno del servidor al buscar un producto"
            })
        }
    }
}

export const productsControllers = new ProductsControllers();