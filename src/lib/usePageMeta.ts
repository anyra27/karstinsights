import { useEffect } from 'react'

const DEFAULT_TITLE = 'Karst — District-Owned AI Capability'
const DEFAULT_DESCRIPTION =
  'Karst gives school district teams protected time and expert partnership to build working AI systems they own and can keep improving.'

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
