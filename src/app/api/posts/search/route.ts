import { searchPosts } from "@/lib/query/post/query";
import { isAuth } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  const { query } = await request.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  try {
    const searchResults = await searchPosts(query, currentUser?.id!);
    return NextResponse.json({ searchResults }, { status: 200 });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Error searching posts" },
      { status: 500 }
    );
  }
}
