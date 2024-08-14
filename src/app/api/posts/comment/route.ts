import { CommentModel, Results } from "@/lib/models";
import {
  deleteCommentById,
  getComment,
  insertCommentByPostId,
  UpdateCommentById,
} from "@/lib/query/comment/query";

import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { Comment } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * Add Comment
 * @param request
 */
export async function GET(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGIN;
  let comments: Comment[] | undefined = undefined;
  const response = new Response();
  // Receive data from the client
  const postId = request.nextUrl.searchParams.get("postId");
  // Query ...
  const { comments: cmts, message: msg } = await getComment(Number(postId));
  message = msg;
  comments = cmts;

  return createResponse(
    response,
    JSON.stringify({ comments: comments, message: message }),
    {
      status: 200,
    }
  );
}

export async function POST(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGIN;
  let comment: Comment | undefined = undefined;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    // Receive data from the client
    const { postId, commentContent } = await request.json();
    // Query ...
    const { insertedComment, message: msg } = await insertCommentByPostId(
      postId,
      commentContent,
      currentUser?.id!
    );
    message = msg;
    comment = insertedComment;
  }

  return createResponse(
    response,
    JSON.stringify({ comment: comment, message: message }),
    {
      status: 200,
    }
  );
}

interface UpdateCommentResponse {
  isEdited: boolean;
  updatedComment?: CommentModel;
  message: string;
}

export async function PATCH(request: NextRequest) {
  let message: Results | string = Results.REQUIRED_LOGIN;
  let updatedComment: CommentModel | undefined = undefined;
  let isEdited = false;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  if (isLoggedIn) {
    const { commentId, commentContent } = await request.json();
    const {
      isEdited: _isEdited,
      updatedComment: _updatedComment,
      message: _message,
    }: UpdateCommentResponse = await UpdateCommentById(
      commentId,
      currentUser?.id!,
      commentContent
    );
    isEdited = _isEdited;
    updatedComment = _updatedComment;
    message = _message;
  }

  return createResponse(
    response,
    JSON.stringify({ isEdited, updatedComment: updatedComment, message }),
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGIN;
  let isDeleted: boolean = false;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    const { commentId } = await request.json();
    const { isDeleted: _isDeleted, message: _message } =
      await deleteCommentById(commentId, currentUser?.id!);
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
