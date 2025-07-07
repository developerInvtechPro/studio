
import type { User } from './types';

// This is a mock user database. In a real application, you would
// replace this with a connection to a real database like Firestore,
// PostgreSQL, or MySQL. For this demo, passwords are in plain text.
// In a production environment, always hash and salt passwords.
const users: User[] = [
  { id: '1', username: 'admin', password: 'password' },
  { id: '2', username: 'cajero1', password: 'password123' },
  { id: '3', username: 'cajero2', password: 'password456' },
];

/**
 * Finds a user by their username and password.
 * @param username The username to search for.
 * @param password The password to validate.
 * @returns The user object if found and the password is correct, otherwise null.
 */
export async function validateUser(username: string, password: string): Promise<User | null> {
  // Simulate an async database call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = users.find(u => u.username === username);

  // In a real app, you would use a library like bcrypt to compare a hashed password.
  // For example: const isValid = await bcrypt.compare(password, user.password);
  if (user && user.password === password) {
    // Return the user object without the password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}
