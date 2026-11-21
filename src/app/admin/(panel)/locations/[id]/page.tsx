import Link from "next/link";
import { notFound } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SchemaForm from "@/components/admin/SchemaForm";
import { locationSections } from "@/lib/admin-schemas";
import { db } from "@/lib/db";
import { deleteLocation, saveLocation } from "../../../actions";

export default async function EditLocation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const l = isNew ? null : await db.location.findUnique({ where: { id } });
  if (!isNew && !l) notFound();
  const initial = {
    main: {
      city: l?.city ?? "",
      country: l?.country ?? "",
      kind: l?.kind ?? "market",
      description: l?.description ?? "",
      lat: l ? String(l.lat) : "",
      lng: l ? String(l.lng) : "",
      maps: "",
    },
  };
  return (
    <>
      <div className="a-top">
        <div>
          <div className="a-crumb">
            <Link href="/admin/locations">Locations</Link> / {isNew ? "New" : l!.city}
          </div>
          <h1>{isNew ? "Add a location" : l!.city}</h1>
        </div>
        {!isNew ? (
          <form action={deleteLocation.bind(null, id)}>
            <ConfirmButton message={`Delete "${l!.city}"?`}>Delete location</ConfirmButton>
          </form>
        ) : null}
      </div>
      <SchemaForm
        key={l?.updatedAt.toISOString() || "new"}
        sections={locationSections}
        initial={initial}
        save={saveLocation.bind(null, isNew ? null : id)}
        previewHref="/global-presence"
        previewSrc="/api/preview?path=%2Fglobal-presence"
        redirectTo="/admin/locations/{id}"
        submitLabel={isNew ? "Add to the dial" : "Save & publish"}
      />
    </>
  );
}
