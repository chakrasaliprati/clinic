"use client";

import { useSearchParams } from "next/navigation";
import AppointmentForm from "@/components/AppointmentForm";

export default function ConsultationForm({ clinicEnabled, onlineEnabled }) {
  const params = useSearchParams();
  const concern = params.get("concern") || "";
  return <AppointmentForm concernPreset={concern} clinicEnabled={clinicEnabled} onlineEnabled={onlineEnabled} />;
}
