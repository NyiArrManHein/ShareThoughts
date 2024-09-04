import { deleteNotification, getNotification } from "@/lib/query/post/query";
import { isAuth } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = new Response();
  const { isLoggedIn, currentUser } = await isAuth(request, response);
  if (isLoggedIn) {
    const notification = await getNotification(currentUser?.id!);
    console.log("Api notification", notification);
    return NextResponse.json(notification);
  }
}

export async function DELETE(request: NextRequest) {
  const { notificationId } = await request.json();
  const { isDeleted, message } = await deleteNotification(notificationId);

  return NextResponse.json({ isDeleted, message });
}
