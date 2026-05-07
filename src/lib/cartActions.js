import { endpoints } from './api'

export function redirectToLoginForCart(navigate, pathname = '/') {
  navigate('/login', {
    state: {
      from: pathname,
      reason: 'cart',
    },
  })
}

export async function addProductToCart({
  token,
  navigate,
  pathname,
  productId,
  quantity = 1,
  onSuccess,
}) {
  if (!token) {
    redirectToLoginForCart(navigate, pathname)
    return null
  }

  const response = await endpoints.addToCart({ product_id: productId, quantity })
  if (onSuccess) onSuccess(response.data)
  return response.data
}
