import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { DomainError } from "./types";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/** Run a handler and turn domain and validation errors into clean JSON responses. */
export async function handle(fn: () => Promise<Response> | Response): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof DomainError) return NextResponse.json({ error: { code: e.code, message: e.message } }, { status: e.status });
    if (e instanceof ZodError)
      return NextResponse.json({ error: { code: "BAD_INPUT", message: e.issues[0]?.message ?? "Datos inválidos." } }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: { code: "SERVER", message: "Algo salió mal." } }, { status: 500 });
  }
}

export async function readBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new DomainError("BAD_INPUT", "El cuerpo debe ser JSON.");
  }
  return schema.parse(raw);
}
