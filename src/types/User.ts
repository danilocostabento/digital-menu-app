export type UserRole = "MASTER" | "ADMIN" | "USER";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}
