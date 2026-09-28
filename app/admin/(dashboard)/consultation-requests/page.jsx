import { fetchConsultationRequests } from "@/lib/consultationQuery";
import SearchFilterBar from "./SearchFilterBar";
import RequestsTable from "./RequestsTable";

export const dynamic = "force-dynamic";

export default async function ConsultationRequestsPage({ searchParams }) {
  const requests = await fetchConsultationRequests({ searchParams });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-emerald-deep">Consultation Requests</h1>
        <p className="text-sm text-ink-soft mt-1">{requests.length} request(s) match the current filters.</p>
      </div>

      <SearchFilterBar />
      <RequestsTable requests={requests} />
    </div>
  );
}
