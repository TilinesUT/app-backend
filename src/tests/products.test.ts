import { describe, expect, expectTypeOf, test } from "vitest";
import { ProductsModel, type ProductEntity } from "../models/products-model";

describe("Prueba: Productos", _ => {
    test("Flujo completo: Deberia crear, modificar y finalmente eliminar el elemento", async _ => {
        const elemento = await ProductsModel.create({
            title: "test-product",
            price: 100,
            description: "test-description",
            category: "test-category",
            image: "test-image",
            rating: {
                rate: 10,
                count: 10
            }
        })

        expect(elemento).toEqual(
            expect.objectContaining({
                title: "test-product",
                price: "100.0000",
                description: "test-description",
                category: "test-category",
                image: "test-image",
                rating_rate: 10,
                rating_count: 10
            })
        );

        const modificado = await ProductsModel.update({
            title: "test-product1",
            price: 100,
            description: "test-description",
            category: "test-category",
            image: "test-image",
            rating: {
                rate: 10,
                count: 10
            }
        }, elemento.id)


        expect(modificado).toEqual(
            expect.objectContaining({
                title: "test-product1"
            })
        );

        const eliminado = await ProductsModel.delete(elemento.id);
        expect(eliminado).toEqual(
            expect.objectContaining({
                title: "test-product1",
                price: "100.0000",
                description: "test-description",
                category: "test-category",
                image: "test-image",
                rating: {
                    rate: 10,
                    count: 10
                }
            })
        );
    })

    test("Deberia regresar la lista de productos", async _ => {
        const lista = await ProductsModel.get()
        expectTypeOf(lista)
            .toEqualTypeOf<ProductEntity[]>();
    })
})