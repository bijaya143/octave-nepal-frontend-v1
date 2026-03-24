/**
 * Services Module - Main Export
 *
 * Collection of service functions for external API calls.
 * Organized by user type/domain (student, admin, instructor, etc.)
 *
 * @example
 * ```ts
 * import { studentAuthService, adminAuthService, instructorAuthService } from '@/lib/services';
 *
 * const studentResponse = await studentAuthService.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 *
 * const adminResponse = await adminAuthService.login({
 *   email: 'admin@example.com',
 *   password: 'admin123'
 * });
 *
 * const instructorResponse = await instructorAuthService.login({
 *   email: 'instructor@example.com',
 *   password: 'instructor123'
 * });
 * ```
 */

export * from "./student";
export * from "./admin";
export * from "./instructor";
export * from "./common-types";
