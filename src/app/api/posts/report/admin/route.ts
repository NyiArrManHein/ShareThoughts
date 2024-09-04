// pages/api/reports/index.ts

import prisma from "@/db";
import { Results } from "@/lib/models";
import { deletePostByReportId, getAllReports } from "@/lib/query/post/query";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = new Response();
  const reports = await getAllReports();
  return createResponse(response, JSON.stringify({ reports: reports }), {
    status: 200,
  });
}

export async function PATCH(request: NextRequest) {
  const { reportId } = await request.json();
  // await deletePostByReportId(reportId);\
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  let message: string = Results.REQUIRED_LOGIN;
  let status = 401; // Default status for unauthorized
  if (isLoggedIn) {
    try {
      await deletePostByReportId(reportId);

      // return new NextResponse(
      //   JSON.stringify({ message: "Post and report deleted successfully" }),
      //   { status: 200 }
      // );
      message = "Post and report deleted successfully";
      status = 200; // Status for successful deletion
    } catch (error) {
      console.error("Error deleting post and report:", error);
      // return new NextResponse(
      //   JSON.stringify({ error: "Failed to delete post and report" }),
      //   { status: 500 }
      // );
      message = "Failed to delete post and report";
      status = 500; // Status for internal server error
    }
  }
  return createResponse(response, JSON.stringify({ message: message }), {
    status: status,
  });
}
