// import { getPostById } from "@/lib/query/post/query";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   const { postId } = await request.json();
//   const id = parseInt(postId as string, 10); // Convert postId to integer

//   try {
//     const post = await getPostById(id);
//     console.log("Api getPost" + post);
//     return NextResponse.json({ post }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     return NextResponse.json(
//       { message: "Error fetching post" },
//       { status: 500 }
//     );
//   }
// }

import { getPostById } from "@/lib/query/post/query";
import { isAuth } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = new Response();
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    const { isLoggedIn, currentUser } = await isAuth(request, response);

    const { post, message, status } = await getPostById(
      parseInt(postId, 10),
      currentUser?.id!
    );

    if (status !== 200) {
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Error fetching post" },
      { status: 500 }
    );
  }
}
