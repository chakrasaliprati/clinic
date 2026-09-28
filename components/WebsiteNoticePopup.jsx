"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Megaphone } from "lucide-react";

export default function WebsiteNoticePopup({ notice }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notice?.enabled) return;

    const today = new Date().toISOString().slice(0, 10);
    if (notice.start_date && today < notice.start_date) return;
    if (notice.end_date && today > notice.end_date) return;

    if (notice.frequency === "once") {
      try {
        const dismissedKey = `notice-dismissed-${notice.updated_at || notice.title}`;
        if (localStorage.getItem(dismissedKey)) return;
      } catch {
        // localStorage unavailable — just show it
      }
    }

    setVisible(true);
  }, [notice]);

  function dismiss() {
    setVisible(false);
    if (notice?.frequency === "once") {
      try {
        localStorage.setItem(`notice-dismissed-${notice.updated_at || notice.title}`, "1");
      } catch {
        // ignore
      }
    }
  }

  if (!visible || !notice?.title) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-sm px-4 sm:px-0 pb-4 sm:pb-0">
      <div className="rounded-2xl bg-emerald-deep text-cream shadow-cardHover p-5 relative">
        <button
          onClick={dismiss}
          aria-label="Close notice"
          className="absolute top-3 right-3 text-cream/70 hover:text-cream"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 pr-5">
          <Megaphone className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-base mb-1">{notice.title}</p>
            {notice.description && <p className="text-sm text-cream/80 leading-relaxed">{notice.description}</p>}
            {notice.button_text && notice.button_url && (
              <Link
                href={notice.button_url}
                className="inline-block mt-3 text-sm font-semibold text-gold-light underline underline-offset-4"
              >
                {notice.button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
