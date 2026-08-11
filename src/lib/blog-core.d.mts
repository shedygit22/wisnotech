export interface BlogFrontmatter {
  [key: string]: string | string[] | undefined;
}

export interface ParsedPost {
  data: BlogFrontmatter;
  body: string;
}

export declare function parseFrontmatter(raw: string): ParsedPost;
export declare function renderMarkdown(md: string): string;
export declare function slugify(s: string): string;
export declare function readingTime(md: string): number;
export declare function stripMarkdown(md: string): string;
export declare function excerpt(md: string, words?: number): string;