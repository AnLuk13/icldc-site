import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const partners = await db.collection("partners").find({}).toArray()
    return NextResponse.json(partners)
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
