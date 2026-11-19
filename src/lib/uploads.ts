import path from "node:path";

export const UPLOAD_DIR = path.resolve(process.cwd(), "storage", "uploads");
export const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml", "application/pdf", "video/mp4"];
export const MAX_BYTES = 12 * 1024 * 1024;
