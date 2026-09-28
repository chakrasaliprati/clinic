import { getForEditing } from "@/lib/cms/singleton";
import ContactSettingsForm from "./ContactSettingsForm";

export const dynamic = "force-dynamic";

export default async function ContactSettingsPage() {
  const initial = await getForEditing("contact_settings");
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Contact / Get in Touch</h1>
        <p className="text-sm text-ink-soft mt-1">Edit the details shown in the footer, homepage contact section, and Contact page.</p>
      </div>
      <ContactSettingsForm initial={initial} />
    </div>
  );
}
