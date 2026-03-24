/**
 * Shared authentication utilities
 */

export type UserType = "ADMIN" | "STUDENT" | "INSTRUCTOR";

export interface BaseUser {
  id: string;
  email: string;
  userType: string;
  [key: string]: unknown;
}

/**
 * Validates if the stored user data has the correct userType
 */
export function validateUserType(
  userData: string | null,
  expectedUserType: UserType
): boolean {
  if (!userData) return false;

  try {
    const user = JSON.parse(userData) as BaseUser;
    return user.userType === expectedUserType;
  } catch {
    return false;
  }
}

/**
 * Gets the user type from localStorage user data
 */
export function getUserType(): UserType | null {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;

    const user = JSON.parse(userData) as BaseUser;
    return user.userType as UserType;
  } catch {
    return null;
  }
}

/**
 * Checks if user is authenticated with specific user type
 */
export function isAuthenticatedAs(userType: UserType): boolean {
  const userData = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");

  if (!userData || !accessToken) return false;

  return validateUserType(userData, userType);
}

/**
 * Clears all authentication data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
