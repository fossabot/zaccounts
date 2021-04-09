import { assert } from 'chai'
import { mergePath, mergeScope } from './base'

describe('mergeScope', () => {
  it('root absolute', () => assert.equal(mergeScope('.', '.a'), '.a'))
  it('root relative', () => assert.equal(mergeScope('.', 'a'), '.a'))
  it('root empty', () => assert.equal(mergeScope('.', ''), '.'))
  it('nonroot absolute', () => assert.equal(mergeScope('.a', '.b'), '.b'))
  it('nonroot relative', () => assert.equal(mergeScope('.a', 'b'), '.a.b'))
  it('nonroot empty', () => assert.equal(mergeScope('.a', ''), '.a'))
})

describe('mergePath', () => {
  it('root empty', () => assert.equal(mergePath('/', ''), '/'))
  it('root slash', () => assert.equal(mergePath('/', '/'), '/'))
  it('root prefix', () => assert.equal(mergePath('/', '/a'), '/a'))
  it('root nonprefix', () => assert.equal(mergePath('/', 'a'), '/a'))
  it('nonroot empty', () => assert.equal(mergePath('/a', ''), '/a'))
  it('nonroot slash', () => assert.equal(mergePath('/a', '/'), '/a'))
  it('nonroot prefix', () => assert.equal(mergePath('/a', '/b'), '/a/b'))
  it('nonroot nonprefix', () => assert.equal(mergePath('/a', 'b'), '/a/b'))
})
