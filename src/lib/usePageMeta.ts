import { useEffect } from 'react'

const DEFAULT_TITLE = 'Karst — Data & Intelligence for Executive Teams'
const DEFAULT_DESCRIPTION =
  'Operating intelligence for the people who run the organization. We build the dashboards, decisions, and rhythms your leadership thinks in.'

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
