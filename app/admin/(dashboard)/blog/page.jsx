import { listAll } from "@/lib/cms/collection";
import PostsList from "./PostsList";
import NewPostForm from "./NewPostForm";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await listAll("blog_posts", "display_order");

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-emerald-deep">Blog</h1>
          <p className="text-sm text-ink-soft mt-1">Write, edit, and publish articles. No image uploads needed — the site design handles the visuals.</p>
        </div>
        <NewPostForm />
      </div>
      <PostsList posts={posts} />
    </div>
  );
}
