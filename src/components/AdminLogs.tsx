import { useState } from "react";

type Log = {
  id: string;
  created_at: string;
  status: "success" | "error";
  title?: string;
  wp_url?: string;
  error_step?: string;
  error_message?: string;
};

type Tab = "all" | "success" | "error";

export default function AdminLogs() {
  const [code, setCode] = useState("");
  const [items, setItems] = useState<Log[]>([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const load = async (nextTab: Tab = tab) => {
    setError("");
    const params = new URLSearchParams();
    if (nextTab !== "all") params.set("status", nextTab);
    if (from) params.set("from", new Date(from).toISOString());
    if (to) params.set("to", new Date(`${to}T23:59:59`).toISOString());

    try {
      const r = await fetch(`/api/logs?${params}`, {
        headers: { "x-n33-code": code },
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(
          typeof body.error === "string"
            ? body.error
            : "Clave inválida o Supabase no configurado.",
        );
        return;
      }
      setItems(Array.isArray(body) ? body : []);
      setUnlocked(true);
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  };

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Administración</h1>
        <p className="mt-2 text-sm text-n33-text/70">
          Historial de publicaciones (Supabase)
        </p>
        <input
          className="mt-5 w-full border p-3"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Clave de administración"
        />
        <button
          className="mt-3 w-full bg-n33-blue p-3 font-bold text-white"
          onClick={() => load()}
        >
          Ver historial
        </button>
        {error && <p className="mt-3 text-red-600">{error}</p>}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow md:p-8">
      <h1 className="text-2xl font-bold">Panel de administración</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "success", "error"] as Tab[]).map((value) => (
          <button
            key={value}
            className={`rounded px-4 py-2 text-sm font-bold ${
              tab === value
                ? "bg-n33-blue text-white"
                : "bg-n33-bg text-n33-text"
            }`}
            onClick={() => {
              setTab(value);
              load(value);
            }}
          >
            {value === "all"
              ? "Todas"
              : value === "success"
                ? "Publicadas"
                : "Errores"}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          Desde
          <input
            className="mt-1 block border p-2"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="text-sm">
          Hasta
          <input
            className="mt-1 block border p-2"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <button
          className="bg-n33-blue px-4 py-2 text-sm font-bold text-white"
          onClick={() => load()}
        >
          Filtrar
        </button>
        <button
          className="px-4 py-2 text-sm underline"
          onClick={() => {
            setFrom("");
            setTo("");
            load(tab);
          }}
        >
          Limpiar
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-n33-text/70">No hay registros para este filtro.</p>
        ) : (
          items.map((item) => (
            <article className="border border-n33-ad p-4" key={item.id}>
              <p className="text-sm text-n33-text/70">
                <b>{item.status === "success" ? "Publicada" : "Error"}</b> ·{" "}
                {new Date(item.created_at).toLocaleString("es-MX")}
              </p>
              <p className="mt-1 font-bold">{item.title || "Sin título"}</p>
              {item.wp_url && (
                <a
                  className="mt-2 inline-block underline"
                  href={item.wp_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir nota en WordPress
                </a>
              )}
              {item.error_message && (
                <p className="mt-2 text-red-600">
                  {item.error_step}: {item.error_message}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
