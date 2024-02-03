import { NextRequest } from "next/server";
import { createResponse, getSession } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import {
  getPostForNewsFeed,
  insertPostByUsername,
} from "@/lib/query/post/query";

export async function GET(request: NextRequest) {
  const response = new Response();
  const posts = await getPostForNewsFeed();
  return createResponse(response, JSON.stringify({ posts: posts }), {
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  let insertedPost = undefined;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    const { postType, title, content } = await request.json();
    insertedPost = await insertPostByUsername(
      currentUser?.username!,
      postType,
      title,
      content
    );
  }
  return createResponse(response, JSON.stringify({ post: insertedPost }), {
    status: 200,
  });
}

// fetchUserByResetPasswordToken()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
