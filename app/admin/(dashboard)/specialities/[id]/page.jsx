import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getForEditing } from "@/lib/cms/collection";
import SpecialityForm from "./SpecialityForm";

export const dynamic = "force-dynamic";

export default async function EditSpecialityPage({ params }) {
  const speciality = await getForEditing("specialities", params.id);
  if (!speciality) return notFound();

  return (
    <div>
      <Link href="/admin/specialities" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-emerald-deep mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Specialities
      </Link>
      <h1 className="font-display text-2xl text-emerald-deep mb-6">{speciality.name || "Edit Speciality"}</h1>
      <SpecialityForm initial={speciality} />
    </div>
  );
}
