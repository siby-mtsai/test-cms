// Shape returned by Payload CMS for the "blogs" collection.
// Adjust field names here if your Payload collection config differs.

export interface PayloadMedia {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: PayloadMedia;
}

export interface BlogCategory {
  id: string;
  title: string;
  slug: string;
}

export interface Blog {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  image?: PayloadMedia;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}