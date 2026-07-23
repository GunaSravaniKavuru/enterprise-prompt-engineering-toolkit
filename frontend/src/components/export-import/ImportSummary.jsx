import Card from "../common/Card";

export default function ImportSummary({ imported }) {
  return (
    <Card className="border border-white/10 bg-[rgba(10,12,20,0.7)] p-5">
      <h3 className="text-lg font-semibold text-ink">
        Import Complete
      </h3>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-green-400">
          Status: Success
        </p>

        <p className="mt-2 text-ink">
          {imported}
        </p>
      </div>
    </Card>
  );
}