import { NextResponse } from "next/server";
import { providerStatus } from "@/config/env";

export function GET() {
  return NextResponse.json({ ok: true, mode: providerStatus(), ts: new Date().toISOString() });
}
