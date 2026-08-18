/**
 * Builders for the Lexical JSON the richText fields store.
 *
 * The design expressed link-bearing prose as an array of "runs" in
 * content/pages.json. Lexical is the CMS equivalent: same idea, but the school
 * edits it with a cursor and a link button instead of hand-editing JSON.
 */

type TextNode = {
  type: 'text'
  text: string
  format: number
  style: string
  mode: 'normal'
  detail: number
  version: 1
}

type LinkNode = {
  type: 'link'
  version: 3
  format: ''
  indent: 0
  direction: 'ltr'
  fields: {
    linkType: 'custom' | 'internal'
    url?: string
    newTab: boolean
    doc?: { relationTo: 'pages'; value: number }
  }
  children: TextNode[]
}

type ParagraphNode = {
  type: 'paragraph'
  version: 1
  format: ''
  indent: 0
  direction: 'ltr'
  textFormat: 0
  textStyle: ''
  children: (TextNode | LinkNode)[]
}

export type LexicalRoot = {
  root: {
    type: 'root'
    format: ''
    indent: 0
    version: 1
    direction: 'ltr'
    children: ParagraphNode[]
  }
}

const textNode = (text: string): TextNode => ({
  type: 'text',
  text,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

/** Plain prose. */
export const plain = (text: string): Run => ({ kind: 'text', text })

/** A link to any URL — external, or an in-site path like `/bg#beginners`. */
export const url = (text: string, href: string, newTab?: boolean): Run => ({
  kind: 'url',
  text,
  href,
  newTab: newTab ?? /^https?:\/\//i.test(href),
})

/** A link to another CMS page, by document id. Survives a slug rename. */
export const doc = (text: string, pageId: number): Run => ({ kind: 'doc', text, pageId })

export type Run =
  | { kind: 'text'; text: string }
  | { kind: 'url'; text: string; href: string; newTab: boolean }
  | { kind: 'doc'; text: string; pageId: number }

const runToNode = (run: Run): TextNode | LinkNode => {
  if (run.kind === 'text') return textNode(run.text)

  if (run.kind === 'url') {
    return {
      type: 'link',
      version: 3,
      format: '',
      indent: 0,
      direction: 'ltr',
      fields: { linkType: 'custom', url: run.href, newTab: run.newTab },
      children: [textNode(run.text)],
    }
  }

  return {
    type: 'link',
    version: 3,
    format: '',
    indent: 0,
    direction: 'ltr',
    fields: {
      linkType: 'internal',
      newTab: false,
      doc: { relationTo: 'pages', value: run.pageId },
    },
    children: [textNode(run.text)],
  }
}

const paragraph = (runs: Run[]): ParagraphNode => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
  children: runs.map(runToNode),
})

/** One or more paragraphs, each a list of runs. */
export const richText = (...paragraphs: Run[][]): LexicalRoot => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs.map(paragraph),
  },
})
