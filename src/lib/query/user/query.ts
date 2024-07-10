import EmailTemplate from "@/emails/EmailTemplate";
import prisma from "@/db";
import { User } from "@/lib/models";
import {
  HashPassword,
  generateToken,
  getExpireDate,
  sendMail,
  sendMailWithNodemailer,
} from "@/lib/utils";

export async function getUserByEmail(email?: string) {
  if (email) {
    const data = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

export async function getUserByUsername(username?: string) {
  if (username) {
    const data = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

export async function insertResetPasswordTokenByEmail(email?: string) {
  let token: string | undefined = undefined;
  if (email) {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        resetPasswordToken: generateToken(),
        resetPasswordTokenExpire: getExpireDate(1440),
      },
    });
    if (user && user.resetPasswordToken) {
      token = user.resetPasswordToken;
    }
  }
  return { token };
}

export async function insertVerifyTokenByEmail(email?: string) {
  let token: string | undefined = undefined;
  if (email) {
    const user = await prisma.user.findFirst({
      where: { email: email, verified: false },
    });
    if (user) {
      const user = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          verifyToken: generateToken(),
          verifyTokenExpire: getExpireDate(1440),
        },
      });
      if (user && user.verifyToken) {
        token = user.verifyToken;
      }
    }
  }
  return { token };
}

export async function insertUser(
  firstName?: string,
  lastName?: string,
  email?: string,
  username?: string,
  password?: string,
  host?: string
) {
  let registeredUser: User | undefined = undefined;
  let msg: string = "Please fill in all the field.";

  const hashPassword = new HashPassword();
  if (firstName && lastName && email && username && password) {
    const isUserExists = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });
    if (isUserExists === null) {
      const encryptedPassword = hashPassword.encrypt(password);
      const user = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          username,
          email: email,
          password: encryptedPassword,
          verifyToken: generateToken(),
          verifyTokenExpire: getExpireDate(1440),
        },
      });
      if (user) {
        registeredUser = user as User;
        msg = `Registered successfully as ${registeredUser.username}.`;
        // Send verification email
        const template = EmailTemplate({
          description: "to complete verification",
          lastName: registeredUser.lastName,
          token: registeredUser.verifyToken,
          host: host!,
          path: "/verify/",
          // path: "/users/verify?token=",
          buttonValue: "Verify",
        });
        // try {
        //   await sendMail(registeredUser.email, "Verify your email", template);
        //   msg += " Verification email sent.";
        // } catch (error) {
        //   msg += " Failed to send verification email.";
        //   console.error("Error sending email:", error);
        // }

        try {
          await sendMailWithNodemailer(
            registeredUser.email,
            "Verify your email",
            template
          );
          msg += " Verification email sent.";
        } catch (error) {
          msg += " Failed to send verification email.";
          console.error("Error sending email:", error);
        }

        // const sentEmailId = await sendMail(
        //   user.email,
        //   "Todo: Verify your email",
        //   EmailTemplate({
        //     description: "to complete the verification",
        //     username: user.username,
        //     token: user.verifyToken!,
        //     path: "/users/verify/",
        //     buttonValue: "Verify",
        //   })
        // );
        // const sentEmailId = await sendMailWithNodemailer(
        //   user.email,
        //   "Todo: Verify your email",
        //   EmailTemplate({
        //     description: "to complete the verification",
        //     lastName: user.lastName!,
        //     token: user.verifyToken!,
        //     host: host!,
        //     path: "/users/verify/",
        //     buttonValue: "Verify",
        //   })
        // );
        // msg = sentEmailId
        //   ? msg + ` And sent the verification link to ${user.email}.`
        //   : msg + ` Failed to send the verification link to ${user.email}`;
        // return sentEmailId ? (user as User) : undefined;
      } else {
        msg = "Failed to register the user.";
      }
    } else {
      msg = `User already exist with ${username} or ${email}.`;
    }
  }
  return { user: registeredUser, msg: msg };
}

export async function getUserByResetPasswordToken(resetToken?: string) {
  if (resetToken) {
    const data = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpire: {
          gt: new Date(),
        },
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

export async function getUserByVerifyTokenAndVerified(
  verifyToken?: string,
  verified?: boolean
) {
  if (verifyToken && verified !== undefined) {
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: verifyToken,
        verified: verified,
        verifyTokenExpire: {
          gt: new Date(),
        },
      },
    });
    return user;
  }
  return undefined;
}

export async function updateVerifiedByVerifyToken(verifyToken?: string) {
  if (
    verifyToken &&
    (await getUserByVerifyTokenAndVerified(verifyToken, false))
  ) {
    const data = await prisma.user.update({
      where: {
        verifyToken: verifyToken,
        verifyTokenExpire: {
          gt: new Date(),
        },
        verified: false,
      },
      data: {
        verified: true,
        verifyTokenExpire: new Date(),
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

export async function updatePasswordByResetPasswordToken(
  token?: string,
  password?: string
) {
  const hashPassword = new HashPassword();
  if (token && password) {
    const encryptedPassword = hashPassword.encrypt(password);
    const user = await prisma.user.update({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpire: {
          gt: new Date(),
        },
      },
      data: {
        password: encryptedPassword,
        resetPasswordTokenExpire: new Date(),
      },
    });
    if (user) {
      return user;
    }
  }
  return undefined;
}

export async function fetchUserByResetPasswordToken(token?: string) {
  if (token) {
    const data = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpire: {
          gt: new Date(),
        },
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

export async function insertSessionIdByEmail(email?: string) {
  let sessionId: string | undefined = undefined;
  let message: string = "Please provide required data to login.";
  if (email) {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        sessionId: generateToken(),
      },
    });
    message = "Incorrect email or password. Please try again.";
    if (user) {
      sessionId = user.sessionId!;
      message = `Logged in successfully as ${user.username}.`;
    }
  }
  return { sessionId, message };
}
