import { Comment, Like, Share } from "@prisma/client";

export type FlashMessage = {
  message: string;
  category: string;
};

export type User = {
  id: number;
  accountType: AccountType;
  username: string;
  bio: string;
  sessionId: string;
  verified: boolean;
};

export type PostModel = {
  id: number;
  postType: PostType;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  author: User;
  likes: Like[];
  comments: Comment[];
  shares: Share[];
};

/**
 * Results
 */
export enum Results {
  REQUIRED_LOGIN = "You need to login to perform this action",
  REQUIRED_LOGOUT = "You need to logged out in order to perform this action",
  SUCCESS = "Operation succeed",
  FAIL = "Operation failed",
  SERVER_ERROR = "Server error",
  CONNECTION_ERROR = "Connection error occcured",
  AUTH_ERROR = "Username or password is incorrect",
}

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export type Role = (typeof Role)[keyof typeof Role];

export const Gender = {
  PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY",
  MALE: "MALE",
  FEMALE: "FEMALE",
};

export type Gender = (typeof Gender)[keyof typeof Gender];

export const AccountType = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
};

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const PostType = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
  ONLYME: "ONLYME",
};

export type PostType = (typeof PostType)[keyof typeof PostType];

/**
 * Messages
 */
export enum Messages {
  REQUIRED_LOGIN = "You need to login to perform this action",
  REQUIRED_LOGOUT = "You need to logged out in order to perform this action",
  INVALID_REQUEST = "Unauthorised Request",
}
