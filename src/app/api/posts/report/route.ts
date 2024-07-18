import { NextRequest, NextResponse } from "next/server";
import { createResponse, getSession } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { Results } from "@/lib/models";
import { checkReport, reportPost } from "@/lib/query/post/query";
import prisma from "@/db";

export async function GET(request: NextRequest) {
  let message: string = "User not authenticated";
  let isReported = false;
  let status = 401;

  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  if (isLoggedIn) {
    const postId = parseInt(
      request.nextUrl.searchParams.get("postId") || "",
      10
    );

    if (isNaN(postId)) {
      message = "Invalid postId";
      status = 400;
    } else {
      isReported = await checkReport(postId, currentUser?.id!);
      message = isReported
        ? "Post has been reported by the user"
        : "Post has not been reported by the user";
      status = 200;
    }
  }

  return NextResponse.json({ isReported, message }, { status });
}
export async function POST(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGIN;
  let isReported = false;
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  if (isLoggedIn) {
    const { postId } = await request.json();
    const report = await reportPost(postId, currentUser?.id!);
    if (report) {
      message = "Reported the post successfully";
      isReported = true;
    } else {
      message = "Failed to report the post";
    }
  }

  return NextResponse.json({ isReported, message }, { status: 200 });
}
