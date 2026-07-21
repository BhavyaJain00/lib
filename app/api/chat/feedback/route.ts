import { NextResponse } from "next/server";
import { updateChatTalkScore } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messageId, score } = body;

    if (!messageId || typeof score !== "number") {
      return NextResponse.json(
        { error: "messageId and numeric score are required" },
        { status: 400 }
      );
    }

    const updated = await updateChatTalkScore(messageId, score === 1 ? 1 : -1);

    return NextResponse.json({ success: true, talk: updated });
  } catch (error) {
    console.error("Error in /api/chat/feedback route:", error);
    return NextResponse.json(
      { error: "Failed to record feedback" },
      { status: 500 }
    );
  }
}
