import { useEffect } from 'react'

const DEFAULT_TITLE = 'Karst — District-Owned AI Capability'
const DEFAULT_DESCRIPTION =
  'Karst builds internal AI capability with school district leadership teams. The work is delivered during the engagement. The capability remains.'

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
