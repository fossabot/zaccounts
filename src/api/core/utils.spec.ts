import { assert } from 'chai'
import { mergePath, mergeScope, verifyScope } from './utils'

describe('mergeScope', () => {
  it('root absolute', () => {
    assert.equal(mergeScope('.', '.a'), '.a')
    assert.equal(mergeScope('.', 'a'), '.a')
    assert.equal(mergeScope('.', ''), '.')
  })
  it('nonroot absolute', () => {
    assert.equal(mergeScope('.a', '.b'), '.b')
    assert.equal(mergeScope('.a', 'b'), '.a.b')
    assert.equal(mergeScope('.a', ''), '.a')
  })
})

describe('mergePath', () => {
  it('root empty', () => {
    assert.equal(mergePath('/', ''), '/')
    assert.equal(mergePath('/', '/'), '/')
    assert.equal(mergePath('/', '/a'), '/a')
    assert.equal(mergePath('/', 'a'), '/a')
  })
  it('nonroot empty', () => {
    assert.equal(mergePath('/a', ''), '/a')
    assert.equal(mergePath('/a', '/'), '/a')
    assert.equal(mergePath('/a', '/b'), '/a/b')
    assert.equal(mergePath('/a', 'b'), '/a/b')
  })
})

describe('verifyScope', () => {
  it('root scope', () => {
    assert.isTrue(verifyScope([], '.'))
    assert.isTrue(verifyScope(['.a'], '.'))
  })
  it('root scopes', () => {
    assert.isTrue(verifyScope(['.'], '.'))
    assert.isTrue(verifyScope(['.a'], '.'))
  })
  it('empty', () => assert.isFalse(verifyScope([], 'a')))
  it('all', () => assert.isTrue(verifyScope(['.'], '.a')))
  it('prefixed all', () => {
    assert.isTrue(verifyScope(['.a'], '.a.b'))
    assert.isFalse(verifyScope(['.a'], '.b.c'))
  })
  it('equal', () => {
    assert.isTrue(verifyScope(['.a.b'], '.a.b'))
    assert.isFalse(verifyScope(['.a.b'], '.a.c'))
  })
})
