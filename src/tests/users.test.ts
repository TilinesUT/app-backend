import { describe, expect, test } from "vitest";
import { UserModel } from "../models/users-model";

describe("Prueba: Usuarios", _ => {
    test("Deberia regresar el usuario insertado", async _ => {
        const elemento = await UserModel.create({
            name: 'test-user',
            user: 'test-user',
            password: '12345',
            role: 'ADMIN',
        })

        expect(elemento).toEqual(
            expect.objectContaining({
                name: 'test-user',
                role: 'ADMIN',
                password: '12345',
                user: 'test-user',
            })
        );
    })

    test("Deberia regresar la lista de usuarios", async _ => {
        const lista = await UserModel.get()
        expect(lista).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'test-user',
                    role: 'ADMIN'
                })
            ])
        );
    })
})