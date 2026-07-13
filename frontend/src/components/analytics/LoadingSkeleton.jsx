import Card from "../common/Card";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="h-36 animate-pulse border border-white/10 p-5">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="mt-5 h-8 w-28 rounded-2xl bg-white/10" />
            <div className="mt-4 h-3 w-full rounded-full bg-white/10" />
            <div className="mt-2 h-3 w-2/3 rounded-full bg-white/10" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="h-80 animate-pulse border border-white/10 p-6">
          <div className="h-4 w-40 rounded-full bg-white/10" />
          <div className="mt-6 h-52 rounded-2xl bg-white/5" />
        </Card>
        <Card className="h-80 animate-pulse border border-white/10 p-6">
          <div className="h-4 w-40 rounded-full bg-white/10" />
          <div className="mt-6 h-52 rounded-2xl bg-white/5" />
        </Card>
      </div>
    </div>
  );
}
