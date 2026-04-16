import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const partner = searchParams.get("partner")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (partner) {
      if (!ObjectId.isValid(partner)) {
        return NextResponse.json({ message: "Invalid partner id" }, { status: 400 })
      }
      filter.partners = new ObjectId(partner)
    }

    const db = await getDb()
    const projects = await db.collection("projects").find(filter).toArray()
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
