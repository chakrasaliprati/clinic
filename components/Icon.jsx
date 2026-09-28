import * as Icons from "lucide-react";

// Server-component icon lookup: supports ANY lucide-react icon name the admin
// types into a speciality. Not used from client components (see
// app/consultation/ConsultationTypes.jsx for a tiny client-safe map).
export default function Icon({ name, className = "w-6 h-6", strokeWidth = 1.75 }) {
  const LucideIcon = Icons[name] || Icons.Leaf;
  return <LucideIcon className={className} strokeWidth={strokeWidth} />;
}
