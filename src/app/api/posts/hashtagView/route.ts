import { getHashTagPosts } from "@/lib/query/post/query";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { decodedHashtagId } = await request.json();

  try {
    const posts = await getHashTagPosts(decodedHashtagId);
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}
