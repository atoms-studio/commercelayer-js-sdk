// TODO remove ts-ignore comments
import { InitConfig } from '../resources/Initialize'
import library from '../resources/library'
import { CollectionResponse } from '../resources/@types/Library'

export type Meta = {
  pageCount?: number
  recordCount?: number
  mode?: string
}

class BaseClass extends library.Base {
  __meta: Meta = {}
  __collectionMeta: Meta = {}
  includes: (...attribute: string[]) => this
  all: () => Promise<CollectionResponse<this>>
  getMetaInfo() {
    return this.__meta
  }
  pageCount() {
    return this.__meta.pageCount
  }
  recordCount() {
    return this.__meta.recordCount
  }
  mode() {
    return this.__meta.mode
  }
  setMetaInfo(meta: object) {
    return (this.__meta = meta)
  }
  setCollectionMetaInfo(meta: object) {
    return (this.__collectionMeta = meta)
  }
  klass() {
    // @ts-ignore
    const interceptors = super.klass().interface().axios.interceptors
    // @ts-ignore
    this.constructor.includeMetaInfo(interceptors)
    // @ts-ignore
    return super.klass()
  }
  association(name: string) {
    // @ts-ignore
    const interceptors = super.association(name).interface().axios.interceptors
    // @ts-ignore
    this.constructor.includeMetaInfo(interceptors)
    // @ts-ignore
    return super.association(name)
  }
  withCredentials({ accessToken, endpoint, cache }: InitConfig) {
    // @ts-ignore
    this.constructor.includeMetaInfo()
    // @ts-ignore
    if (!this.constructor.accessToken && !this.constructor.endpoint) {
      // @ts-ignore
      if (!this.constructor.resourceLibrary.headers?.Authorization) {
        // @ts-ignore
        this.constructor.accessToken = `Bearer `
        // @ts-ignore
        this.constructor.endpoint = this.constructor.resourceLibrary.baseUrl
      } else {
        // @ts-ignore
        this.constructor.accessToken = this.constructor.resourceLibrary.headers.Authorization
        // @ts-ignore
        this.constructor.endpoint = this.constructor.resourceLibrary.baseUrl
      }
    }
    // @ts-ignore
    this.constructor.resourceLibrary.headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    // @ts-ignore
    this.__links = {
      // @ts-ignore
      related: `${endpoint}/api/${this.constructor.queryName}`,
      // @ts-ignore
      self: `${endpoint}/api/${this.constructor.queryName}/${this.id}`,
    }
    // @ts-ignore
    this.constructor.singleRequest = true
    // @ts-ignore
    this.constructor.cache = cache
    return this
  }
}

export default BaseClass
