import { getFollowers, getFollowing } from "@/lib/query/post/query";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = parseInt(searchParams.get("userId") || "", 10);

  // Extract the dynamic route segment (followers or following)
  const type = request.nextUrl.pathname.split("/").pop();

  if (isNaN(userId)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    // let usernames;
    let users;
    if (type === "followers") {
      users = await getFollowers(userId);
    } else if (type === "following") {
      users = await getFollowing(userId);
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
