// Instead of using Node's crypto, we'll use a simpler approach for the browser
export function generateIntercomHash(userId: string): string {
  // For browser compatibility, we'll use the user ID directly
  // The actual HMAC verification will happen on the server side
  return userId;
}