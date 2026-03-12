import Skeleton from "@/components/Skeleton";

export default function AdminLoading() {
  return (
    <div style={{ padding: "40px 0" }}>
      <div className="container">
        <Skeleton height={40} width={300} style={{ marginBottom: 32 }} />
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          <Skeleton height={40} width={200} />
          <Skeleton height={40} width={200} />
          <Skeleton height={40} width={200} />
        </div>
        <div className="grid-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto auto", gap: 16, alignItems: "center" }}>
                <Skeleton height={20} width={120} />
                <Skeleton height={20} width={180} />
                <Skeleton height={20} width={80} />
                <Skeleton height={20} width={80} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
