import { client } from "../config/prismaClient";

export const addItem = async (
  userId: string,
  variantId: string,
  quantity: number
) => {
  const variant = await client.productVariant.findUnique({
    where: { id: variantId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  });
  if (!variant) throw new Error("ProductVariantNotFound");
  if (variant.product.status !== "Active")
    throw new Error("productIsNotAvailalble");
  const cart = await client.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
  const existingItem = await client.cartItem.findFirst({
    where: { cartId: cart.id, productvariantId: variantId },
  });
  if (existingItem) {
    return await client.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }
  return await client.cartItem.create({
    data: { cartId: cart.id, productvariantId: variantId, quantity },
  });
};
export const gettingItems = async (userId: string) => {
  return await client.cart.findFirst({
    where: { userId },
    include: {
      cartItems: {
        include: {
          productVariant: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
