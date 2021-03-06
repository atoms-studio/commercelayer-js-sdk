import CLayer from '../src'
import { getTokenBlueBrand } from '../helpers/getToken'

let blueBrandConfig = { accessToken: '', endpoint: '' }
const { ENDPOINT, SKU_ID } = process.env
beforeAll(async () => {
  const { accessToken } = await getTokenBlueBrand()
  blueBrandConfig = {
    accessToken: accessToken,
    endpoint: ENDPOINT,
  }
  return null
})

it('CRUD - Sync select with init', async () => {
  expect.assertions(1)
  CLayer.init(blueBrandConfig)

  const sku = await CLayer.Sku.find(SKU_ID)
  expect(sku.id).toBe(SKU_ID)
})

it('CRUD - Sync select with init and tuning mode', async () => {
  expect.assertions(1)
  CLayer.init(blueBrandConfig)

  const sku = await CLayer.Sku.find(SKU_ID, {
    rawResponse: true
  })
  expect((sku.data as any).id).toBe(SKU_ID)
})

it('Checking credentials', async () => {
  expect.assertions(3)
  const sku = CLayer.Sku.withCredentials(blueBrandConfig)
  expect(sku.resourceLibrary.baseUrl).toBe(`${blueBrandConfig.endpoint}/api/`)
  expect(sku.resourceLibrary.headers.Authorization).toBe(
    `Bearer ${blueBrandConfig.accessToken}`
  )
  const skus = await sku.first(1)
  expect(skus.length).toBe(1)
})

it('CRUD - Sync update', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).find(
    SKU_ID
  )
  expect(sku.id).toBe(SKU_ID)
  const skuUpdate = await sku
    .withCredentials(blueBrandConfig)
    .update({ description: 'Unit test async description' })
  return expect(skuUpdate.description).toBe('Unit test async description')
})

it('CRUD - Async update', () => {
  expect.assertions(2)
  return CLayer.Sku.withCredentials(blueBrandConfig)
    .find(SKU_ID)
    .then((s) => {
      expect(s.id).toBe(SKU_ID)
      return s.withCredentials(blueBrandConfig).update(
        {
          description: 'Unit test async description',
        },
        (u) => {
          return expect(u.description).toBe('Unit test async description')
        }
      )
    })
})

it('CRUD - Sync multi-connection select', async () => {
  expect.assertions(1)
  const blueSku = await CLayer.Sku.withCredentials(blueBrandConfig).find(
    SKU_ID
  )
  expect(blueSku.id).toBe(SKU_ID)
})
// it('CRUD - Async multi-connection update', () => {
//   expect.assertions(4)
//   CLayer.Sku.withCredentials(blueBrandConfig)
//     .find('wZeDdSamqn')
//     .then(s => {
//       expect(s.id).toBe('wZeDdSamqn')
//       s.withCredentials(blueBrandConfig)
//         .update({
//           description: 'Unit test async description with multi-connection'
//         })
//         .catch(e => {
//           console.log('e', e)
//         })
//       return expect(s.description).toBe(
//         'Unit test async description with multi-connection'
//       )
//     })
//     .catch(e => {
//       console.log('e', e)
//     })
// })
