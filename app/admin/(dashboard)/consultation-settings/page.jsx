import { getForEditing } from "@/lib/cms/singleton";
import ConsultationSettingsForm from "./ConsultationSettingsForm";

export const dynamic = "force-dynamic";

export default async function ConsultationSettingsPage() {
  const initial = await getForEditing("consultation_settings");
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Consultation Settings</h1>
        <p className="text-sm text-ink-soft mt-1">Control clinic and online consultation availability, timings, and the WhatsApp message template.</p>
      </div>
      <ConsultationSettingsForm initial={initial} />
    </div>
  );
}
