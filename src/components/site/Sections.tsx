import type { CSSProperties, ReactNode } from "react";
import { sectionOrder, styleAttrs, type Layout } from "@/lib/layout";

/** Renders a page's sections in the order chosen in the CMS, skipping hidden ones and applying per-section styles. */
export default function Sections({ page, data, blocks }: { page: string; data: Record<string, any>; blocks: Record<string, ReactNode> }) {
  const layout: Layout = data?._layout || {};
  return (
    <>
      {sectionOrder(page, layout).map((key) => {
        const node = blocks[key];
        const st = layout.sections?.[key] || {};
        if (!node || st.hidden) return null;
        const { attrs, vars } = styleAttrs(st);
        return (
          <div key={key} className="sec-shell" data-section={key} {...attrs} style={vars as CSSProperties}>
            {node}
          </div>
        );
      })}
    </>
  );
}
