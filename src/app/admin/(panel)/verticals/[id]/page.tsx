import Link from "next/link";
import { notFound } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SchemaForm from "@/components/admin/SchemaForm";
import { verticalSections } from "@/lib/admin-schemas";
import { parseList } from "@/lib/content";
import { db } from "@/lib/db";
import { deleteVertical, saveVertical } from "../../../actions";

export default async function EditVertical({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const v = isNew ? null : await db.vertical.findUnique({ where: { id } });
  if (!isNew && !v) notFound();

  const initial = {
    main: { title: v?.title ?? "", slug: v?.slug ?? "", icon: v?.icon ?? "", summary: v?.summary ?? "" },
    media: { image: v?.image ?? "", imageAlt: v?.imageAlt ?? "", imagePosition: v?.imagePosition ?? "center" },
    detail: { intro: v?.intro ?? "", body: v?.body ?? "", capabilities: parseList(v?.capabilities ?? "[]").map((text) => ({ text })) },
    seo: { title: v?.seoTitle ?? "", description: v?.seoDescription ?? "" },
  };

  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">
            <Link href="/admin/verticals">Services</Link> / {isNew ? "New" : v!.title}
          </div>
          <h1>{isNew ? "Add a service" : v!.title}</h1>
        </div>
        {!isNew ? (
          <form action={deleteVertical.bind(null, id)}>
            <ConfirmButton message={`Delete "${v!.title}"? This cannot be undone.`}>Delete this service</ConfirmButton>
          </form>
        ) : null}
      </div>
      <SchemaForm
        sections={verticalSections}
        initial={initial}
        save={saveVertical.bind(null, isNew ? null : id)}
        previewHref={!isNew ? `/businesses/${v!.slug}` : undefined}
        previewSrc={!isNew ? `/api/preview?path=${encodeURIComponent(`/businesses/${v!.slug}`)}` : undefined}
        redirectTo={isNew ? "/admin/verticals/{id}" : undefined}
        submitLabel={isNew ? "Create service" : "Save & publish"}
      />
    </>
  );
}
