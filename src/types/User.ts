export type UserRole = "MASTER" | "ADMIN";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}
