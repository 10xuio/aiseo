import { db } from "@/db";
import { topics } from "@/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { getUser } from "@/auth/server";
import type { Topic } from "@/types/topic";
import { revalidatePath } from "next/cache";
import { cleanUrl } from "@/lib/utils";

export async function deleteTopic(topicId: string) {
  const user = await getUser();
  if (!user) throw new Error("User not found");

  try {
    await db
      .delete(topics)
      .where(and(eq(topics.id, topicId), eq(topics.userId, user.id)));

    revalidatePath("/dashboard/topics");
  } catch (error) {
    console.error("Failed to delete topic:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getTopics(): Promise<Topic[]> {
  const user = await getUser();
  if (!user) throw new Error("User not found");

  try {
    const topicsData = await db.query.topics.findMany({
      where: eq(topics.userId, user.id),
      orderBy: desc(topics.createdAt),
    });

    return topicsData;
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return [];
  }
}

export interface CreateTopicFromUrlData {
  url: string;
}

export async function createTopicFromUrl(
  data: CreateTopicFromUrlData
): Promise<{ success: boolean; topicId?: string; error?: string }> {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");

    const domain = cleanUrl(data.url);
    const name = domain.split(".")[0];
    const description = `Topic for ${cleanUrl(data.url)}`;

    const [newTopic] = await db
      .insert(topics)
      .values({
        name,
        logo: domain,
        description,
        userId: user.id,
      })
      .returning({ id: topics.id });

    revalidatePath("/dashboard/topics");

    return {
      success: true,
      topicId: newTopic.id,
    };
  } catch (error) {
    console.error("Failed to create topic:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
