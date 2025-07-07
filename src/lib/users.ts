
'use server';

import type { User } from './types';
import { getDbConnection } from './db';

/**
 * Finds a user by their username and password.
 * In a production environment, always hash and salt passwords.
 * @param username The username to search for.
 * @param password The password to validate.
 * @returns The user object if found and the password is correct, otherwise null.
 */
export async function validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
  const db = await getDbConnection();
  
  // In a real app, you would select a hashed password and compare it.
  const user = await db.get<User>('SELECT id, username, password FROM users WHERE username = ?', username);

  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}
