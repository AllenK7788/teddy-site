import type { Metadata } from "next";
import posts from "@/data/posts.json";
import PostsClient, { type Post } from "./PostsClient";

export const metadata: Metadata = {
  title: "Teddy's 30 Days — Content Calendar",
  description:
    "All 30 days of Teddy's content calendar: topics and ready-to-use captions, searchable and copyable.",
  robots: { index: false, follow: false },
};

export default function PostsPage() {
  return <PostsClient posts={posts as Post[]} />;
}
