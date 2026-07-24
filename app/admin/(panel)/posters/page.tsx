import { getAllPosters } from "@/lib/db";
import { PosterControls } from "@/components/admin/poster-controls";

export const dynamic = "force-dynamic";

export default async function AdminPostersPage() {
  const posters = await getAllPosters();

  return (
    <div>
      <PosterControls posters={posters} />
    </div>
  );
}
