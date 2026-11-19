import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import SchemaForm from "@/components/admin/SchemaForm";
import { getContent } from "@/lib/content";
import { getAdminView, getPageSchema } from "@/lib/content-schema";
import { db } from "@/lib/db";
import { savePage, savePageDraft } from "../../../actions";

export default async function EditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (key === "settings") redirect("/admin/pages/header");
  const view = getAdminView(key);
  if (!view) notFound();
  const schema = getPageSchema(view.contentKey);
  if (!schema) notFound();
  const sections = view.sectionKeys ? schema.sections.filter((s) => view.sectionKeys!.includes(s.key)) : schema.sections;

  // Start every editing session from the published version
  await db.pageDraft.deleteMany({ where: { key: view.contentKey } });
  const data = await getContent(view.contentKey);
  const isPage = view.group === "pages";

  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">
            <Link href="/admin">Home</Link> / {isPage ? "Pages" : "Whole website"}
          </div>
          <h1>{view.label}</h1>
          <p>
            {isPage
              ? `${schema.description} Each box below is one part of the page, in the same order as on the website.`
              : "These settings are shared by every page of the website."}
          </p>
        </div>
        {schema.path ? (
          <a className="a-btn ghost" href={schema.path} target="_blank" rel="noreferrer">
            Open this page
          </a>
        ) : null}
      </div>
      <SchemaForm
        key={view.slug}
        sections={sections}
        initial={data}
        save={savePage.bind(null, view.contentKey)}
        saveDraft={savePageDraft.bind(null, view.contentKey)}
        previewHref={view.previewPath}
        previewSrc={`/api/preview?path=${encodeURIComponent(view.previewPath)}`}
        layout={!schema.noLayout}
        submitLabel="Save & publish"
        contentKey={view.contentKey}
      />
    </>
  );
}
