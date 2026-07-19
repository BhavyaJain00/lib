import { getUpload } from "@/lib/uploads";

/**
 * Serves admin-uploaded files that couldn't be written to public/uploads
 * (read-only hosts keep them in memory — see lib/uploads.ts). Files that do
 * exist on disk are served statically by Next before this route is reached.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const file = await getUpload(name);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      // Upload names embed a timestamp, so a URL's content never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
