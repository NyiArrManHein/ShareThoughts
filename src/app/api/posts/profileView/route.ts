import { getUserPosts } from "@/lib/query/post/query";
import { isAuth } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const { authorId } = await request.json();
//     const { userPosts, followerCount, followingCount } = await getUserPosts(
//       parseInt(authorId, 10)
//     );
//     return NextResponse.json(
//       { userPosts, followerCount, followingCount },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json(
//       { error: "Unable to fetch posts" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(request: NextRequest) {
  try {
    const response = new Response();
    const { isLoggedIn, currentUser } = await isAuth(request, response);

    const { authorId } = await request.json();
    const profileUserId = parseInt(authorId, 10);

    if (isNaN(profileUserId) || profileUserId <= 0) {
      return NextResponse.json(
        { error: "Invalid profile user ID" },
        { status: 400 }
      );
    }

    const { userPosts, followerCount, followingCount } = await getUserPosts(
      isLoggedIn ? currentUser?.id! : null,
      profileUserId
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
