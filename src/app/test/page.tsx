import { Map } from "~/components/map";

export default function TestMapPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-4xl border border-border rounded-lg shadow-lg overflow-hidden">
        <Map />
      </div>
    </main>
  )
}