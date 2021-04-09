import { assert } from 'chai'
import { Container } from './di'

describe('DI', () => {
  describe('Container', () => {
    const SYM_A = Symbol()
    const SYM_B = Symbol()
    const SYM_C = Symbol()
    const SYM_D = Symbol()
    const SYM_E = Symbol()
    let c_called = false
    let c_count = 0
    let d_called = false
    const c = () => {
      c_called = true
      c_count++
      return 3
    }
    const d = async () => {
      d_called = true
      return 4
    }
    describe('provide', () => {
      it('value', () => Container.provide(SYM_A, 1))
      it('promise', () => Container.provide(SYM_B, Promise.resolve(2)))
      it('fn', () => Container.provide(SYM_C, c))
      it('async_fn', () => Container.provide(SYM_D, d))
      it('dup', () => {
        assert.throws(() => Container.provide(SYM_A, 1))
      })
    })
    describe('lazy_exec', () => {
      it('fn', () => assert.isTrue(!c_called))
      it('async_fn', () => assert.isTrue(!d_called))
    })
    describe('get', () => {
      it('values', async () => {
        assert.equal(await Container.get(SYM_A), 1)
        assert.equal(await Container.get(SYM_B), 2)
        assert.equal(await Container.get(SYM_C), 3)
        assert.equal(await Container.get(SYM_D), 4)
      })
      it('exec_once', async () => {
        assert.equal(await Container.get(SYM_C), 3)
        assert.equal(await Container.get(SYM_C), 3)
        assert.equal(c_count, 1)
      })
      it('lazy_provide', async () => {
        setImmediate(() => Container.provide(SYM_E, 5))
        assert.equal(await Container.get(SYM_E, true), 5)
      })
    })
  })
})
