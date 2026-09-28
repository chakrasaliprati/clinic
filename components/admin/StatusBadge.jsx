const styles = {
  new: "bg-gold-light text-gold-deep",
  contacted: "bg-emerald-light text-emerald-deep",
  follow_up: "bg-amber-100 text-amber-700",
  solved: "bg-emerald text-cream",
};

const labels = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow-up",
  solved: "Solved",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex text-xs font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 ${styles[status] || styles.new}`}>
      {labels[status] || status}
    </span>
  );
}
