import { Results } from "@/lib/models";
import { deleteReportByReportId } from "@/lib/query/post/query";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const { reportId } = await request.json();
  // await deletePostByReportId(reportId);\
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  let message: string = Results.REQUIRED_LOGIN;
  let status = 401; // Default status for unauthorized
  if (isLoggedIn) {
    try {
      await deleteReportByReportId(reportId);

      message = "Report removed successfully";
      status = 200; // Status for successful deletion
    } catch (error) {
      console.error("Error removing the report:", error);

      message = "Failed to removing the report";
      status = 500; // Status for internal server error
    }
  }
  return createResponse(response, JSON.stringify({ message: message }), {
    status: status,
  });
}
