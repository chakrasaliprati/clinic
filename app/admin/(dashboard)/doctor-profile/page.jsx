import { getForEditing } from "@/lib/cms/singleton";
import DoctorProfileForm from "./DoctorProfileForm";

export const dynamic = "force-dynamic";

export default async function DoctorProfilePage() {
  const initial = await getForEditing("doctor_profile");

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Doctor Profile</h1>
        <p className="text-sm text-ink-soft mt-1">Edit the details shown across the site and on the About Doctor page.</p>
      </div>
      <DoctorProfileForm initial={initial} />
    </div>
  );
}
