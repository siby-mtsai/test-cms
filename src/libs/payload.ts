import type { Blog, PayloadListResponse } from "@/types/blog";

const PAYLOAD_URL =
  process.env.PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_PAYLOAD_URL ??
  "http://localhost:3000";

interface FetchBlogsOptions {
  limit?: number;
  page?: number;
  category?: string;
  /** Next.js cache revalidation window, in seconds. */
  revalidate?: number;
}

export async function fetchBlogs({
  limit = 9,
  page = 1,
  category,
  revalidate = 60,
}: FetchBlogsOptions = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
    depth: "1",
    sort: "-publishedDate",
  });

  if (category) {
    params.set("where[category.slug][equals]", category);
  }

  params.set("depth", "1");
  params.set(
    "populate",
    JSON.stringify({
      image: true,
    }),
  );

  const url = `${PAYLOAD_URL}/api/blogs?depth=2&${params.toString()}`;

  const res = await fetch(url, { next: { revalidate } });
  const json = await res.json();

  return json;
}

export async function fetchBlogById(
  id: string,
  revalidate = 60,
): Promise<Blog | null> {
  const res = await fetch(
    `${PAYLOAD_URL}/api/blogs/${id}?depth=1`,
    { next: { revalidate } },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch blog "${id}": ${res.status}`);
  }

  return res.json();
}
