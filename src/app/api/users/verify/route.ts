import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import {
  getUserByVerifyTokenAndVerified,
  updateVerifiedByVerifyToken,
} from "@/lib/query/user/query";

export async function POST(request: NextRequest) {
  let isVerified = false;
  let message = "Verification Failed";
  const response = new Response();
  const session = await getSession(request, response);

  const { token } = await request.json();

  const user = await getUserByVerifyTokenAndVerified(token, false);
  if (user) {
    const verifiedUser = await updateVerifiedByVerifyToken(token);
    if (verifiedUser) {
      if (session.user) {
        session.user = verifiedUser as User;
        await session.save();
      }
      message = "User verified successfully.";
      isVerified = verifiedUser.verified;
    }
  }
  return createResponse(
    response,
    JSON.stringify({
      isVerified: isVerified,
      message: message,
    }),
    { status: 200 }
  );
}

// Add this function to handle GET requests for verification
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const token = searchParams.get("token");

//   let isVerified = false;
//   let message = "Verification Failed";

//   if (token) {
//     const user = await getUserByVerifyTokenAndVerified(token, false);
//     if (user) {
//       const verifiedUser = await updateVerifiedByVerifyToken(token);
//       if (verifiedUser) {
//         // message = "User verified successfully.";
//         // isVerified = true;
//         // Redirect to the success page
//         return NextResponse.redirect("/users/verify/success");
//       }
//     }
//   }

// If verification fails, redirect to a failure page or show a message
// return NextResponse.redirect("/users/verify/failure");
// return createResponse(
//   new Response(),
//   JSON.stringify({
//     isVerified: isVerified,
//     message: message,
//   }),
//   { status: isVerified ? 200 : 400 }
// );
