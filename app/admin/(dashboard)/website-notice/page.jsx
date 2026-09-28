import { getForEditing } from "@/lib/cms/singleton";
import WebsiteNoticeForm from "./WebsiteNoticeForm";

export const dynamic = "force-dynamic";

export default async function WebsiteNoticePage() {
  const initial = await getForEditing("website_notice");
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Website Notice</h1>
        <p className="text-sm text-ink-soft mt-1">Show a site-wide announcement popup, e.g. "Online consultations available".</p>
      </div>
      <WebsiteNoticeForm initial={initial} />
    </div>
  );
}
