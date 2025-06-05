import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { currentUser } from "@clerk/nextjs/server";
import { HistoryTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: any) {
  const { content, recordId } = await req.json();
  const user = await currentUser();
  try {
    // insert record
    const result = await db.insert(HistoryTable).values({
      recordId: recordId,
      content: content,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: new Date().toString(),
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(e);
  }
}

export async function PUT(req: any) {
  const { content, recordId } = await req.json();
  const user = await currentUser();

  try {
    // Insert record
    const result = await db
      .update(HistoryTable)
      .set({
        content: content,
      })
      .where(eq(HistoryTable.recordId, recordId));
  } catch (e) {
    return NextResponse.json(e);
  }
}
