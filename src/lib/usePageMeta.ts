import { useEffect } from 'react'

const DEFAULT_TITLE = 'Karst — Practical AI Capability for School Districts'
const DEFAULT_DESCRIPTION =
  'Karst helps superintendents and cabinet teams build practical AI capability, decision intelligence, and working systems their districts own.'

/**
 * Per-route document title + meta description for the SPA. The defaults live
 * in index.html for crawlers and link unfurlers; this keeps the visible tab
 * title and description honest as the visitor navigates.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Karst` : DEFAULT_TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description ?? DEFAULT_DESCRIPTION)
    return () => {
      document.title = DEFAULT_TITLE
      if (meta) meta.setAttribute('content', DEFAULT_DESCRIPTION)
    }
  }, [title, description])
}
