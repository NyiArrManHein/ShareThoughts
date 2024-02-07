import { NextRequest } from "next/server";
import { createResponse, getSession } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import {
  deletePostById,
  getPostForNewsFeed,
  insertPostByUsername,
} from "@/lib/query/post/query";
import { Results } from "@/lib/models";

// Read Posts
export async function GET(request: NextRequest) {
  const response = new Response();
  const posts = await getPostForNewsFeed();
  return createResponse(response, JSON.stringify({ posts: posts }), {
    status: 200,
  });
}

// Creating Post
export async function POST(request: NextRequest) {
  let insertedPost = undefined;
  let message: string = Results.REQUIRED_LOGIN;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    const { postType, title, content } = await request.json();
    insertedPost = await insertPostByUsername(
      currentUser?.id!,
      postType,
      title,
      content
    );
    message = insertedPost ? "Uploaded the post successfully" : message;
  }
  return createResponse(
    response,
    JSON.stringify({ post: insertedPost, message: message }),
    {
      status: 200,
    }
  );
}

// Delete Post
export async function DELETE(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGIN;
  let isDeleted: boolean = false;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    const { postId } = await request.json();
    const { isDeleted: _isDeleted, message: _message } = await deletePostById(
      postId,
      currentUser?.id!
    );
    message = _message;
    isDeleted = _isDeleted;
  }
  return createResponse(
    response,
    JSON.stringify({ isDeleted: isDeleted, message: message }),
    {
      status: 200,
    }
  );
}
