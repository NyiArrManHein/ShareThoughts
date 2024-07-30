import { searchPosts } from "@/lib/query/post/query";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  try {
    const searchResults = await searchPosts(query);
    return NextResponse.json({ searchResults }, { status: 200 });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Error searching posts" },
      { status: 500 }
    );
  }
}
