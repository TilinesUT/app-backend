import type { Response } from "express"

export type ApiResponse = {
    ok: boolean,
    status: number,
    res?: any,
    msg?: any,
    err?: any
}

export type ApiPromise = Response<ApiResponse>