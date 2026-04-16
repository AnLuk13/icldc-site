import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const events = await db.collection("events").find({}).toArray()
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
