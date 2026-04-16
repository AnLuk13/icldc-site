import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray()
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
