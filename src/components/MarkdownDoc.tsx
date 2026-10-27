import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  markdown: string
}

function plainText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(plainText).join('')
  if (typeof node === 'object' && 'props' in node) {
    return plainText((node as { props?: { children?: ReactNode } }).props?.children)
  }
  return ''
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s.-]/g, '')
    .trim()
    .replace(/[\s.]+/g, '-')
    .replace(/-+/g, '-')
}

/** Stable deep-link aliases for former top-nav pages */
function headingAlias(text: string): string | undefined {
  if (/^4\.4\b/i.test(text) || /mobile-only claim/i.test(text)) return 'claim-gps'
  if (/^4\.5\b/i.test(text) || /mobile agent/i.test(text)) return 'mobile-coop'
  if (/lab gps/i.test(text)) return 'lab-gps'
  return undefined
}

function Heading({
  as: Tag,
  children,
  className,
}: {
  as: 'h1' | 'h2' | 'h3' | 'h4'
  children: ReactNode
  className: string
}) {
  const text = plainText(children)
  const id = slugify(text)
  const alias = headingAlias(text)
  return (
    <>
      {alias && alias !== id ? <span id={alias} className="scroll-mt-28" /> : null}
      <Tag id={id} className={className}>
        {children}
      </Tag>
    </>
  )
}

export function MarkdownDoc({ markdown }: Props) {
  // Strip raw HTML anchors — react-markdown does not render them; Heading aliases cover deep links.
  const cleaned = markdown.replace(/<a\s+id="[^"]*"\s*><\/a>\s*/gi, '')

  return (
    <article className="markdown-doc space-y-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <Heading
              as="h1"
              className="scroll-mt-28 border-b border-[var(--border)] pb-2 text-2xl font-bold tracking-tight text-[var(--text)]"
            >
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading
              as="h2"
              className="scroll-mt-28 mt-10 border-b border-[var(--border)] pb-2 text-lg font-semibold tracking-tight text-[var(--text)]"
            >
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading as="h3" className="scroll-mt-28 mt-6 text-base font-semibold text-[var(--text)]">
              {children}
            </Heading>
          ),
          h4: ({ children }) => (
            <Heading as="h4" className="scroll-mt-28 mt-4 text-sm font-semibold text-[var(--text)]">
              {children}
            </Heading>
          ),
          p: ({ children }) => <p className="my-2">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[var(--amber)] hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1.5 pl-5 marker:text-[var(--amber)]">{children}</ul>,
          ol: ({ children }) => (
            <ol className="my-2 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-[var(--amber)]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-0.5">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-[var(--text)]">{children}</strong>,
          em: ({ children }) => <em className="italic text-[var(--text-muted)]">{children}</em>,
          hr: () => <hr className="my-8 border-[var(--border)]" />,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-[var(--amber)]/50 bg-[color-mix(in_srgb,var(--bg-panel)_55%,transparent)] py-2 pl-4 text-[var(--text-muted)]">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = Boolean(className?.includes('language-') || String(children).includes('\n'))
            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-sm border border-[var(--border)] bg-[var(--bg)] p-3 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text)]">
                  {children}
                </code>
              )
            }
            return (
              <code className="rounded-sm bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] px-1 py-0.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <pre className="my-3 overflow-x-auto">{children}</pre>,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-sm border border-[var(--border)]">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-panel)_70%,transparent)]">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="px-3 py-2 font-medium text-[var(--text)]">{children}</th>,
          td: ({ children }) => <td className="border-t border-[var(--border)]/70 px-3 py-2.5 align-top">{children}</td>,
          tr: ({ children }) => <tr>{children}</tr>,
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </article>
  )
}
