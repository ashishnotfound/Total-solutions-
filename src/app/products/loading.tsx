import Skeleton from "@/components/Skeleton";

export default function ProductsLoading() {
  return (
    <div style={{ padding: "80px 0" }}>
      <div className="container">
        <div className="grid-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 32, textAlign: "center" }}>
              <Skeleton height={120} width={80} borderRadius="var(--radius-lg)" style={{ margin: "0 auto 24px" }} />
              <Skeleton height={24} style={{ marginBottom: 12, width: "80%", margin: "0 auto" }} />
              <Skeleton height={16} style={{ marginBottom: 16, width: "60%", margin: "0 auto" }} />
              <Skeleton height={20} width={140} style={{ margin: "0 auto" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
