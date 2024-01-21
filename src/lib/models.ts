export type FlashMessage = {
  message: string;
  category: string;
};

export type User = {
  id: number;
  joinedAt: Date;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bod: Date;
  gender: Gender;
  role: Role;
  bio: string;
  sessionId: string;
  verified: boolean;
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

/**
 * Messages
 */
export enum Messages {
  REQUIRED_LOGIN = "You need to login to perform this action",
  REQUIRED_LOGOUT = "You need to logged out in order to perform this action",
  INVALID_REQUEST = "Unauthorised Request",
}
