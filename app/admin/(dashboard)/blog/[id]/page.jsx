import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getForEditing } from "@/lib/cms/collection";
import BlogPostForm from "./BlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const post = await getForEditing("blog_posts", params.id);
  if (!post) return notFound();

  return (
    <div>
      <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-emerald-deep mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>
      <h1 className="font-display text-2xl text-emerald-deep mb-6">{post.title || "Edit Post"}</h1>
      <BlogPostForm initial={post} />
    </div>
  );
}
