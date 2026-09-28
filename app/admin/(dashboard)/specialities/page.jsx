import Link from "next/link";
import { listAll } from "@/lib/cms/collection";
import SpecialitiesList from "./SpecialitiesList";
import NewSpecialityForm from "./NewSpecialityForm";

export const dynamic = "force-dynamic";

export default async function SpecialitiesPage() {
  const specialities = await listAll("specialities", "display_order");

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl text-emerald-deep">Specialities</h1>
          <p className="text-sm text-ink-soft mt-1">Add, edit, reorder, and publish the conditions treated at the clinic.</p>
        </div>
        <NewSpecialityForm />
      </div>

      <SpecialitiesList specialities={specialities} />
    </div>
  );
}
