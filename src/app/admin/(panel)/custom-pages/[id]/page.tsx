import Link from "next/link";
import { notFound } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SchemaForm from "@/components/admin/SchemaForm";
import { customPageSections } from "@/lib/admin-schemas";
import { db } from "@/lib/db";
import { deleteCustomPage, saveCustomPage } from "../../../actions";

export default async function EditCustomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const p = isNew ? null : await db.customPage.findUnique({ where: { id } });
  if (!isNew && !p) notFound();
  let sections: any[] = [];
  try {
    sections = JSON.parse(p?.sections || "[]");
  } catch {}
  const initial = {
    main: { title: p?.title ?? "", slug: p?.slug ?? "", eyebrow: p?.eyebrow ?? "", intro: p?.intro ?? "", heroImage: p?.heroImage ?? "" },
    content: { sections: sections.length ? sections : [{ heading: "", text: "", image: "", imageAlt: "" }] },
    seo: { title: p?.seoTitle ?? "", description: p?.seoDescription ?? "" },
  };
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">
            <Link href="/admin/custom-pages">Custom Pages</Link> / {isNew ? "New" : p!.title}
          </div>
          <h1>{isNew ? "New page" : p!.title}</h1>
          {!isNew ? <p>{p!.published ? `Live at /${p!.slug}` : "Hidden — publish it from the Custom Pages list."}</p> : null}
        </div>
        {!isNew ? (
          <form action={deleteCustomPage.bind(null, id)}>
            <ConfirmButton message={`Delete "${p!.title}"? This cannot be undone.`}>Delete page</ConfirmButton>
          </form>
        ) : null}
      </div>
      <SchemaForm
        sections={customPageSections}
        initial={initial}
        save={saveCustomPage.bind(null, isNew ? null : id)}
        previewHref={p?.published ? `/${p.slug}` : undefined}
        previewSrc={p ? `/api/preview?path=${encodeURIComponent(`/${p.slug}`)}` : undefined}
        redirectTo={isNew ? "/admin/custom-pages/{id}" : undefined}
        submitLabel={isNew ? "Create page" : "Save changes"}
      />
    </>
  );
}
