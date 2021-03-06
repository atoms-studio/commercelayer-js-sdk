import {
  getIntegrationToken,
  getSalesChannelToken,
} from '@commercelayer/js-auth'

type AuthType = 'integration' | 'salesChannel'

// BLUE BRAND
export const getTokenBlueBrand = async (type: AuthType = 'integration') => {
  const {
    ENDPOINT,
    CLIENT_ID,
    CLIENT_SECRET,
    SALES_CHANNEL_ID,
    SCOPE,
  } = process.env
  return type === 'integration'
    ? await getIntegrationToken({
        endpoint: ENDPOINT,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        scope: SCOPE,
      })
    : await getSalesChannelToken({
        endpoint: ENDPOINT,
        clientId: SALES_CHANNEL_ID,
        scope: SCOPE,
      })
}

export const getTokenBlueBrandWeb = async (
  type: AuthType = 'integration',
  config
) => {
  return type === 'integration'
    ? await getIntegrationToken(config)
    : await getSalesChannelToken(config)
}
