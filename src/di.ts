interface DIItem<T> {
  key: symbol
  gn: () => T | Promise<T>
  value?: Promise<T>
}

class DIContainer {
  private pendings = new Map<symbol, [(v: any) => void, (e: any) => void][]>()
  private generators = new Map<symbol, DIItem<any>>()

  provide<T>(key: symbol, value: T | Promise<T> | (() => T | Promise<T>)) {
    if (typeof value !== 'function') {
      const bak = value
      value = () => bak
    }
    if (this.generators.has(key)) {
      throw new Error(`Duplicate key: ${key.toString()}`)
    } else {
      this.generators.set(key, {
        key,
        // @ts-ignore
        gn: value
      })
      const ps = this.pendings.get(key)
      if (ps) {
        this.get<T>(key)
          .then((v) => ps.forEach(([resolve]) => resolve(v)))
          .catch((e) => ps.forEach(([, reject]) => reject(e)))
      }
    }
  }

  get<T>(key: symbol, lazy?: boolean): Promise<T> {
    const item: DIItem<T> | undefined = this.generators.get(key)
    if (!item) {
      if (!lazy) process.emitWarning('Unregistered DI key: ' + key.toString())
      return new Promise<T>((resolve, reject) => {
        const ps = this.pendings.get(key)
        if (ps) {
          ps.push([resolve, reject])
        } else {
          this.pendings.set(key, [[resolve, reject]])
        }
      })
    } else {
      if (item.value !== undefined) return item.value
      return (item.value = Promise.resolve(item.gn()))
    }
  }
}

export const Container = new DIContainer()
