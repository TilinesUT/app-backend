import type { Response } from "express"

export type ApiResponse = {
    ok: boolean,
    status: number,
    msg: any,
    res?: any,
    err?: any
}

export type ApiPromise = Response<ApiResponse>