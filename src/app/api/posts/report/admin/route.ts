// pages/api/reports/index.ts

import prisma from "@/db";
import { deletePostByReportId, getAllReports } from "@/lib/query/post/query";
import { createResponse } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = new Response();
  const reports = await getAllReports();
  return createResponse(response, JSON.stringify({ reports: reports }), {
    status: 200,
  });
}

export async function DELETE(request: NextRequest) {
  const { reportId } = await request.json();
  // await deletePostByReportId(reportId);

  try {
    await deletePostByReportId(reportId);

    return new NextResponse(
      JSON.stringify({ message: "Post and report deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post and report:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete post and report" }),
      { status: 500 }
    );
  }
}
