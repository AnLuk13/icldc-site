import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }
    const db = await getDb();
    const partner = await db
      .collection("partners")
      .findOne({ _id: new ObjectId(id) });
    if (!partner) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(partner);
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
