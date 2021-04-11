import { Static, TSchema, Type } from '@sinclair/typebox'

export type OptionalSchema = TSchema | null
export type Cast<T extends TSchema | null> = T extends TSchema ? Static<T> : any

export function mergeScope(a: string, b: string) {
  if (!b.length) return a
  if (b.startsWith('.')) return b
  if (a === '.') return a + b
  return a + '.' + b
}

export function mergePath(a: string, b: string) {
  if (!b.length) return a
  if (b.startsWith('/')) return b
  if (a === '/') return a + b
  return a + '/' + b
}

export function mergeSchema(a: OptionalSchema, b: OptionalSchema) {
  if (!(a && b)) return a || b
  if (a.type === 'object' && b.type === 'object')
    return Type.Intersect([a as any, b as any])
  throw new Error(`Cannot merge schema between ${a.type} and ${b.type}`)
}

export type ScopeTree = true | { [key: string]: ScopeTree }

export function buildScopeTree(scopeList: string[]): ScopeTree {
  if (scopeList.length === 1 && scopeList[0] === '*') return true
  const root = {} as ScopeTree
  for (const scope of scopeList) {
    if (scope === '*') throw new Error('Duplicate')
    const tokens = scope.split('.')
    let p = root
    for (let i = 0; i < tokens.length; i++) {
      if (p === true) throw new Error('Duplicate')
      const token = tokens[i]
      if (!token.length) throw new Error('Empty token')
      if (i === tokens.length - 1) {
        if (token in p) throw new Error('Duplicate')
        p[token] = true
      } else {
        if (!(token in p)) p[token] = {}
        p = p[token]
      }
    }
  }
  return root
}

export function matchScope(scope: string, scopeTree: ScopeTree | undefined) {
  if (scopeTree === undefined) return scope === '.'
  if (scope === '.') return true
  const tokens = scope.substring(1).split('.')
  for (const token of tokens) {
    if (scopeTree === true) return true
    scopeTree = scopeTree[token]
  }
  return scopeTree === true
}
