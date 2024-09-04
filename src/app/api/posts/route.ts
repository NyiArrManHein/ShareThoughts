import { NextRequest } from "next/server";
import { createResponse, getSession } from "@/lib/session";
import { extractHashtags, isAuth } from "@/lib/utils";
import {
  UpdatePostById,
  deletePostById,
  getPostForNewsFeed,
  insertPostByUsername,
} from "@/lib/query/post/query";
import { PostModel, Results } from "@/lib/models";

// Read Posts
// export async function GET(request: NextRequest) {
//   const response = new Response();
//   const posts = await getPostForNewsFeed();
//   return createResponse(response, JSON.stringify({ posts: posts }), {
//     status: 200,
//   });
// }

export async function GET(request: NextRequest) {
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  const posts = await getPostForNewsFeed(currentUser?.id!);
  // console.log("Posts: ", posts[0].comments[0].commentLikes);
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

    // if (insertedPost) {
    //   message = "Uploaded the post successfully";
    // }
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

interface UpdatePostResponse {
  isEdited: boolean;
  updatedPost?: PostModel;
  message: string;
}

export async function PATCH(request: NextRequest) {
  let message: Results | string = Results.REQUIRED_LOGIN;
  let updatedPost: PostModel | undefined = undefined;
  let isEdited = false;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  if (isLoggedIn) {
    const { postId, postTitle, postContent, postType } = await request.json();
    const {
      isEdited: _isEdited,
      updatedPost: _updatedPost,
      message: _message,
    }: UpdatePostResponse = await UpdatePostById(
      postId,
      currentUser?.id!,
      postTitle,
      postContent,
      postType
    );
    isEdited = _isEdited;
    updatedPost = _updatedPost;
    message = _message;
  }

  return createResponse(
    response,
    JSON.stringify({ isEdited, updatedPost: updatedPost, message }),
    { status: 200 }
  );
}

// export async function PATCH(request: NextRequest) {
//   let message: Results | string = Results.REQUIRED_LOGIN;
//   // let updatedPost: PostModel | undefined = undefined;
//   let isEdited = false;
//   let updatedPost = undefined;
//   const response = new Response();
//   const { isLoggedIn, currentUser } = await isAuth(request, response);

//   if (isLoggedIn) {
//     const { postId, postTitle, postContent } = await request.json();
//     updatedPost = await UpdatePostById(
//       postId,
//       currentUser?.id!,
//       postTitle,
//       postContent
//     );
//   }

//   return createResponse(
//     response,
//     JSON.stringify({ updatedPost: updatedPost }),
//     {
//       status: 200,
//     }
//   );
// }

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
