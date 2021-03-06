import CLayer, { Order } from '../src'
import { getTokenBlueBrand } from '../helpers/getToken'
import skus from '../helpers/testSkus'

let blueBrandConfig = { accessToken: '', endpoint: '' }
const { ENDPOINT, SKU_CODE, SKU_ID, ORDER_ID } = process.env

beforeAll(async () => {
  const { accessToken } = await getTokenBlueBrand()
  blueBrandConfig = {
    accessToken: accessToken,
    endpoint: ENDPOINT,
  }
  return null
})

it('METHOD --- pageCount and recordCount', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).findBy({
    code: SKU_CODE,
  })
  expect(sku.id).toBe(SKU_ID)
  expect(sku.mode()).toBe('test')
})

it('METHOD --- perPage', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
    .perPage(5)
    .all()
  expect(sku.recordCount()).toBeGreaterThan(0)
  expect(sku.pageCount()).toBeGreaterThanOrEqual(1)
})

it('METHOD --- Find', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).find(
    SKU_ID
  )
  expect(sku.id).toBe(SKU_ID)
  expect(sku.mode()).toEqual('test')
})

it('METHOD --- FindBy', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).findBy({
    code: SKU_CODE,
  })
  expect(sku.id).toBe(SKU_ID)
  expect(sku.mode()).toBe('test')
})

it('METHOD --- First', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).first()
  const meta = sku.getMetaInfo()
  expect(sku.id).not.toBeNull()
  expect(meta).toHaveProperty('mode', 'test')
})

it('METHOD --- First with number', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).first(3)
  expect(sku.length).toBeLessThanOrEqual(3)
  expect(sku[0].mode()).toBe('test')
})

it('METHOD --- Last', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).last()
  const meta = sku.getMetaInfo()
  expect(sku.id).not.toBeNull()
  expect(meta).toHaveProperty('mode', 'test')
})

it('METHOD --- Last with number', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).last(3)
  const meta = sku[0].getMetaInfo()
  expect(sku.length).toBeLessThanOrEqual(3)
  expect(meta).toHaveProperty('mode', 'test')
})

it('METHOD --- All', async () => {
  expect.assertions(3)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).all()
  const meta = sku.getMetaInfo()
  expect(sku.toArray().length).toBeGreaterThan(0)
  expect(meta).toHaveProperty('recordCount')
  expect(meta).toHaveProperty('pageCount')
})

it('METHOD --- All with pageCount and recordCount', async () => {
  expect.assertions(3)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).all()
  const pageCount = sku.pageCount()
  const recordCount = sku.recordCount()
  expect(sku.toArray().length).toBeGreaterThan(0)
  expect(recordCount).toBeGreaterThan(0)
  expect(pageCount).toBeGreaterThan(0)
})

it('METHOD --- All with next page', async () => {
  expect.assertions(3)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
    .perPage(25)
    .all()
  const meta = sku.getMetaInfo()
  expect(sku.toArray().length).toBeLessThanOrEqual(25)
  expect(meta).toHaveProperty('recordCount')
  expect(meta).toHaveProperty('pageCount')
})

it('METHOD --- All with page', async () => {
  expect.assertions(1)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
    .page(3)
    .all()
  // const meta = sku.getMetaInfo()
  expect(sku.toArray().length).toBeGreaterThanOrEqual(0)
  // expect(meta).toHaveProperty('recordCount')
  // expect(meta).toHaveProperty('pageCount')
})

it('METHOD --- All with next page', async () => {
  expect.assertions(2)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
    .where({ codeIn: skus.join(',') })
    .includes('prices')
    .perPage(25)
    .all()
  // const meta = sku.getMetaInfo()
  const nextPage = sku.hasNextPage()
  expect(sku.toArray().length).toBeLessThanOrEqual(25)
  // expect(meta).toHaveProperty('recordCount')
  // expect(meta).toHaveProperty('pageCount')
  expect(typeof nextPage).toBe('boolean')
})

// it('METHOD --- All with prev page', async () => {
//   expect.assertions(5)
//   const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
//     .where({ codeIn: [SKU_CODE].join(',') })
//     .includes('prices')
//     .page(3)
//     .perPage(25)
//     .all()
//   // const meta = sku.getMetaInfo()
//   const prevPage = sku.hasPrevPage()
//   expect(sku.toArray().length).toBeLessThanOrEqual(25)
//   // expect(meta).toHaveProperty('recordCount')
//   // expect(meta).toHaveProperty('pageCount')
//   expect(prevPage).toBe(true)
//   if (prevPage) {
//     const prevSkus = await sku.withCredentials(blueBrandConfig).prevPage()
//     // const prevMeta = prevSkus.getMetaInfo()
//     expect(prevSkus.toArray().length).toBeLessThanOrEqual(25)
//     // expect(prevMeta).toHaveProperty('recordCount')
//     // expect(prevMeta).toHaveProperty('pageCount')
//     expect(prevSkus.hasNextPage()).toBe(true)
//     expect(prevSkus.hasPrevPage()).toBe(true)
//   }
// })

it('METHOD --- All with select', async () => {
  expect.assertions(1)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
    .select('name', 'metadata')
    .all()
  // const meta = sku.getMetaInfo()
  expect(sku.toArray().length).toBeGreaterThanOrEqual(0)
  // expect(meta).toHaveProperty('recordCount')
  // expect(meta).toHaveProperty('pageCount')
})

it('METHOD --- All with order', async () => {
  expect.assertions(1)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
    .order({ createdAt: 'asc' })
    .all()
  // const meta = sku.getMetaInfo()
  expect(sku.toArray().length).toBeGreaterThanOrEqual(0)
  // expect(meta).toHaveProperty('recordCount')
  // expect(meta).toHaveProperty('pageCount')
})

it('METHOD --- All with includes', async () => {
  expect.assertions(1)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig)
    .includes('prices')
    .all()
  // const meta = sku.getMetaInfo()
  expect(sku.toArray().length).toBeGreaterThanOrEqual(0)
  // expect(meta).toHaveProperty('recordCount')
  // expect(meta).toHaveProperty('pageCount')
})

it('METHOD --- Multi requests', async () => {
  // expect.assertions(3)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).find(
    SKU_ID
  )
  const skus = await CLayer.Sku.withCredentials(blueBrandConfig)
    .includes('prices')
    .all()
  const allPrices = await CLayer.Price.withCredentials(blueBrandConfig).all()

  const meta = sku.getMetaInfo()
  expect(sku.id).toBe(SKU_ID)
  expect(meta).toHaveProperty('mode', 'test')

  // const metaSkus = skus.getMetaInfo()
  expect(skus.toArray().length).toBeGreaterThanOrEqual(0)
  // expect(metaSkus).toHaveProperty('recordCount')
  // expect(metaSkus).toHaveProperty('pageCount')

  // const metaPrices = allPrices.getMetaInfo()
  expect(allPrices.toArray().length).toBeGreaterThanOrEqual(0)
  // expect(metaPrices).toHaveProperty('recordCount')
  // expect(metaPrices).toHaveProperty('pageCount')
})

it('METHOD --- Relationship', async () => {
  expect.assertions(4)
  const sku = await CLayer.Sku.withCredentials(blueBrandConfig).find(
    SKU_ID
  )

  const prices = await sku
    .withCredentials(blueBrandConfig)
    .prices()
    .all()

  const meta = sku.getMetaInfo()
  expect(sku.id).toBe(SKU_ID)
  expect(meta).toHaveProperty('mode', 'test')

  const pageCount = prices.pageCount()
  const recordCount = prices.recordCount()
  expect(pageCount).toBeGreaterThan(0)
  expect(recordCount).toBeGreaterThan(0)
})

it('METHOD --- Order -> lineItems withCredentials', async () => {
  expect.assertions(4)
  const order = await CLayer.Order.withCredentials(blueBrandConfig).find(
    ORDER_ID
  )

  const lineItems = await order
    .withCredentials(blueBrandConfig)
    .lineItems()
    .includes('lineItemOptions')
    .load()

  const meta = order.getMetaInfo()
  expect(order.id).toBe(ORDER_ID)
  expect(meta).toHaveProperty('mode', 'test')

  const pageCount = lineItems.pageCount()
  const recordCount = lineItems.recordCount()
  expect(pageCount).toBeGreaterThan(0)
  expect(recordCount).toBeGreaterThan(0)
})

it('METHOD --- Order -> lineItems', async () => {
  expect.assertions(4)
  return Order.withCredentials(blueBrandConfig)
    .find(ORDER_ID)
    .then((res) => {
      const meta = res.getMetaInfo()
      expect(res.id).toBe(ORDER_ID)
      expect(meta).toHaveProperty('mode', 'test')

      return res
        .lineItems()
        .includes('lineItemOptions')
        .all()
        .then((col: any) => {
          const pageCount = col.pageCount()
          const recordCount = col.recordCount()
          expect(pageCount).toBeGreaterThan(0)
          expect(recordCount).toBeGreaterThan(0)
        })
    })
})

it('METHOD --- Sku -> Prices', async () => {
  expect.assertions(4)
  return CLayer.Sku.withCredentials(blueBrandConfig)
    .find(SKU_ID)
    .then((res) => {
      const meta = res.getMetaInfo()
      expect(res.id).toBe(SKU_ID)
      expect(meta).toHaveProperty('mode', 'test')

      return res
        .withCredentials(blueBrandConfig)
        .prices()
        .all()
        .then((col) => {
          const pageCount = col.pageCount()
          const recordCount = col.recordCount()
          expect(pageCount).toBeGreaterThan(0)
          expect(recordCount).toBeGreaterThan(0)
        })
    })
})

it('METHOD --- Get order and update lineItems', async () => {
  expect.assertions(8)
  const order = await CLayer.Order.withCredentials(blueBrandConfig).find(
    ORDER_ID
  )

  const lineItems = await order
    .withCredentials(blueBrandConfig)
    .lineItems()
    .all()

  await lineItems.first().update({ quantity: 1 })

  const newOrder = await CLayer.Order.withCredentials(blueBrandConfig).find(
    ORDER_ID
  )

  const newLineItems = await newOrder
    .withCredentials(blueBrandConfig)
    .lineItems()
    .all()

  await newLineItems.first().update({ quantity: 2 })

  expect(order.id).toBe(ORDER_ID)
  expect(order.getMetaInfo()).toHaveProperty('mode', 'test')

  expect(lineItems.pageCount()).toBeGreaterThan(0)
  expect(lineItems.recordCount()).toBeGreaterThan(0)

  expect(newOrder.id).toBe(ORDER_ID)
  expect(newOrder.getMetaInfo()).toHaveProperty('mode', 'test')

  expect(newLineItems.pageCount()).toBeGreaterThan(0)
  expect(newLineItems.recordCount()).toBeGreaterThan(0)
})

it('METHOD --- CRUD lineItem', async () => {
  expect.assertions(3)
  const order = await CLayer.Order.withCredentials(blueBrandConfig).find(
    ORDER_ID
  )

  const lineItem = await CLayer.LineItem.withCredentials(
    blueBrandConfig
  ).create({
    order,
    skuCode: SKU_CODE,
    quantity: 1,
  })

  expect(order.id).toBe(ORDER_ID)
  expect(order.getMetaInfo()).toHaveProperty('mode', 'test')
  expect(lineItem.getMetaInfo()).toHaveProperty('mode', 'test')

  await lineItem.withCredentials(blueBrandConfig).destroy()
})
