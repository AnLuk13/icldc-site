import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const news = await db.collection("news").find({}).sort({ publishedAt: -1 }).toArray()
    return NextResponse.json(news)
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
