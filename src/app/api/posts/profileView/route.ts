import { getUserPosts } from "@/lib/query/post/query";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { authorId } = await request.json();
    const { userPosts, followerCount, followingCount } = await getUserPosts(
      parseInt(authorId, 10)
    );
    return NextResponse.json(
      { userPosts, followerCount, followingCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Unable to fetch posts" },
      { status: 500 }
    );
  }
}
