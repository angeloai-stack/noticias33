import { useState } from "react";

type Category = { id: number; name: string };

async function api(path: string, code: string, init?: RequestInit) {
  const r = await fetch(path, {
    ...init,
    headers: { "x-n33-code": code, ...init?.headers },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "No fue posible completar la operación.",
    );
  }
  return body;
}

export default function Publisher() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  const unlock = async () => {
    try {
      const data = (await api("/api/categorias", code)) as Category[];
      setCats(data);
      setUnlocked(true);
      setError("");
    } catch {
      setError("La clave no es válida o no se pudo cargar WordPress.");
    }
  };

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Publicar nota</h1>
        <p className="mt-2">Ingresa la clave de redacción para continuar.</p>
        <input
          className="mt-5 w-full border p-3"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && unlock()}
          placeholder="Clave de acceso"
        />
        <button
          className="mt-3 w-full bg-n33-blue p-3 font-bold text-white"
          onClick={unlock}
        >
          Continuar
        </button>
        {error && <p className="mt-3 text-red-600">{error}</p>}
      </section>
    );
  }

  if (!cats.length) {
    return (
      <section className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Publicar nota</h1>
        <p className="mt-4 text-n33-text/70">
          No hay categorías disponibles en WordPress. Crea al menos una categoría
          en el CMS antes de publicar.
        </p>
      </section>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !content || !category) {
      setError("Título, categoría y cuerpo son obligatorios.");
      return;
    }
    setBusy(true);
    try {
      let media: { id: number } | undefined;
      if (file) {
        const form = new FormData();
        form.append("file", file);
        media = await api("/api/media", code, { method: "POST", body: form });
      }
      const tagIds = await Promise.all(
        tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .map(async (name) => (await api(`/api/tags?name=${encodeURIComponent(name)}`, code)).id),
      );
      const result = await api("/api/publicar", code, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          categoryId: Number(category),
          tags: tagIds,
          featuredMediaId: media?.id,
        }),
      });
      setDone(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-3xl space-y-5 rounded-xl bg-white p-6 shadow md:p-10"
    >
      <h1 className="text-3xl font-bold">Nueva publicación</h1>
      {done ? (
        <p className="rounded bg-green-50 p-4">
          Nota publicada.{" "}
          <a className="font-bold underline" href={done} target="_blank" rel="noreferrer">
            Ver nota
          </a>
        </p>
      ) : (
        <>
          <input
            className="w-full border p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título *"
          />
          <input
            className="w-full border p-3"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Subtítulo o resumen"
          />
          <select
            className="w-full border p-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Categoría *</option>
            {cats.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border p-3"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags separados por coma"
          />
          <input
            className="w-full border p-3"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <textarea
            className="min-h-72 w-full border p-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cuerpo de la nota * (admite HTML)"
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            disabled={busy}
            className="bg-n33-blue px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            {busy ? "Publicando…" : "Publicar nota"}
          </button>
        </>
      )}
    </form>
  );
}
