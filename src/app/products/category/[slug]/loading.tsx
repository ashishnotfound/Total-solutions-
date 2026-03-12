import Skeleton from "@/components/Skeleton";

export default function CategoryLoading() {
  return (
    <div style={{ padding: "64px 0" }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <Skeleton height={20} width={120} style={{ marginBottom: 16 }} />
          <Skeleton height={48} width="60%" style={{ marginBottom: 16 }} />
          <Skeleton height={20} width="80%" style={{ marginBottom: 12 }} />
          <Skeleton height={20} width={100} />
        </div>
        <div className="grid-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <Skeleton height={180} borderRadius="var(--radius-lg)" style={{ marginBottom: 16 }} />
              <Skeleton height={20} style={{ marginBottom: 8, width: "70%" }} />
              <Skeleton height={14} style={{ marginBottom: 8, width: "90%" }} />
              <Skeleton height={14} style={{ marginBottom: 16, width: "60%" }} />
              <Skeleton height={20} width={120} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
