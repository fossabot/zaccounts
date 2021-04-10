import { assert } from 'chai'
import { mergePath, mergeScope } from './utils'

describe('mergeScope', () => {
  it('root', () => {
    assert.equal(mergeScope('.', '.a'), '.a')
    assert.equal(mergeScope('.', 'a'), '.a')
    assert.equal(mergeScope('.', ''), '.')
  })
  it('nonroot', () => {
    assert.equal(mergeScope('.a', '.b'), '.b')
    assert.equal(mergeScope('.a', 'b'), '.a.b')
    assert.equal(mergeScope('.a', ''), '.a')
  })
})

describe('mergePath', () => {
  it('root', () => {
    assert.equal(mergePath('/', ''), '/')
    assert.equal(mergePath('/', '/'), '/')
    assert.equal(mergePath('/', '/a'), '/a')
    assert.equal(mergePath('/', 'a'), '/a')
  })
  it('nonroot', () => {
    assert.equal(mergePath('/a', ''), '/a')
    assert.equal(mergePath('/a', '/b'), '/b')
    assert.equal(mergePath('/a', '/'), '/')
    assert.equal(mergePath('/a', 'b'), '/a/b')
  })
})
