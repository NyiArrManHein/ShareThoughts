import { NextRequest, NextResponse } from "next/server";
import { isAuth } from "@/lib/utils";
import {
  getFollowerCount,
  getFollowStatus,
  toggleFollow,
} from "@/lib/query/post/query";
export async function GET(request: NextRequest) {
  let message: string = "User not authenticated";
  let isFollowing = false;
  let status = 401;

  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  if (isLoggedIn) {
    const authorId = parseInt(
      request.nextUrl.searchParams.get("authorId") || "",
      10
    );

    if (isNaN(authorId)) {
      message = "Invalid authorId";
      status = 400;
    } else {
      isFollowing = await getFollowStatus(authorId, currentUser?.id!);
      message = isFollowing
        ? "User is following the author"
        : "User is not following the author";
      status = 200;
    }
  }

  return NextResponse.json({ isFollowing, message }, { status });
}

export async function POST(request: NextRequest) {
  // let message: string = "User not authenticated";
  // let status = 401;

  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  if (isLoggedIn) {
    const { authorId } = await request.json();
    console.log("Received follow request:", { authorId });
    const authorIdInt = parseInt(authorId, 10);

    if (isNaN(authorIdInt)) {
      // message = "Invalid authorId or followerId";
      // status = 400;
      return NextResponse.json(
        { message: "Invalid authorId or followerId" },
        { status: 400 }
      );
    } else {
      try {
        await toggleFollow(authorIdInt, currentUser?.id!);
        const followerCount = await getFollowerCount(parseInt(authorId, 10));

        return NextResponse.json({ followerCount }, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { message: "Failed to follow/unfollow user" },
          { status: 500 }
        );
      }
    }
  }
}
