import {
  Comment,
  CommentLike,
  Like,
  Post,
  ReportReason,
  Share,
} from "@prisma/client";

export type FlashMessage = {
  message: string;
  category: string;
};

export type User = {
  id: number;
  email: string;
  lastName: string | null;
  accountType: AccountType;
  role: Role;
  username: string;
  bio: string;
  sessionId: string;
  verified: boolean;
  verifyToken: string | null;
};

export type LikeWithUser = Like & {
  user: User;
};

export type PostModel = {
  [x: string]: {};
  id: number;
  postType: PostType;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  hashtags: string;
  published: boolean;
  authorId: number;
  author: User;
  likes: LikeWithUser[];
  comments: CommentModel[];
  shares: Share[];
  isDeleted: boolean;
};

export type commentLikeWithUser = CommentLike & {
  user: User;
};

export type CommentModel = {
  id: number;
  user: User;
  createdAt: Date;
  content: string;
  userId: number;
  postId: number;
  commentLikes: commentLikeWithUser[];
};

export type ReactionCounts = {
  LIKE: number;
  LOVE: number;
  SAD: number;
  HAHA: number;
};

export type ReportModel = {
  id: number;
  post: PostModel;
  postId: number;
  reportedBy: User;
  reportedById: number;
  reportReason: ReportReason;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationModel = {
  id: number;
  author: User;
  authorId: number;
  post: Post;
  postId: number;
};

/**~
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

// export const PostType = {
//   PRIVATE: "PRIVATE",
//   PUBLIC: "PUBLIC",
//   ONLYME: "ONLYME",
// };

export enum PostType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  ONLYME = "ONLYME",
}

// export type PostType = (typeof PostType)[keyof typeof PostType];

/**
 * Messages
 */
export enum Messages {
  REQUIRED_LOGIN = "You need to login to perform this action",
  REQUIRED_LOGOUT = "You need to logged out in order to perform this action",
  INVALID_REQUEST = "Unauthorised Request",
}
