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
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await getPostById(parseInt(postId, 10));

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
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
