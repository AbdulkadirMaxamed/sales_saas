"use server";

import { clerkClient } from "@clerk/nextjs/server";

export interface UserInfo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  emailAddress: string | null;
}

export async function getUserById(userId: string): Promise<UserInfo | null> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      emailAddress: user.emailAddresses?.[0]?.emailAddress || null,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUsersById(
  userIds: string[],
): Promise<Map<string, UserInfo>> {
  const userMap = new Map<string, UserInfo>();

  try {
    // Get unique user IDs
    const uniqueUserIds = [...new Set(userIds)];

    // Fetch all users in parallel
    const userPromises = uniqueUserIds.map(async (userId) => {
      const userInfo = await getUserById(userId);
      if (userInfo) {
        userMap.set(userId, userInfo);
      }
    });

    await Promise.all(userPromises);
  } catch (error) {
    console.error("Error fetching multiple users:", error);
  }

  return userMap;
}
