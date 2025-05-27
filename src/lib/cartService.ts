import { Cartitem as CartItemType } from '@/hooks/useCart';
import supabase from './supabase';

export interface DBCartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    maxQuantity: number;
  };
}

/**
 * Get or create a cart for the authenticated user
 */
export const getOrCreateCart = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Call the database function to get or create a cart
  const { data, error } = await supabase
    .rpc('get_or_create_cart')
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

/**
 * Get cart items for a user
 */
export const getCartItems = async (userId: string): Promise<CartItemType[]> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        created_at,
        updated_at,
        product:products(id, name, price, image, inventory_count)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      maxQuantity: item.product.inventory_count
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

/**
 * Get cart items by cart ID
 */
export const getCartItemsByCartId = async (cartId: string): Promise<DBCartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        created_at,
        updated_at,
        product:products(id, name, price, image, inventory_count)
      `)
      .eq('cart_id', cartId);

    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        maxQuantity: item.product.inventory_count
      }
    }));
  } catch (error) {
    console.error('Error fetching cart items by cart ID:', error);
    return [];
  }
};

/**
 * Add item to cart by user ID
 */
export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<boolean> => {
  try {
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity if item exists
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // Insert new item if it doesn't exist
      const { error } = await supabase.from('cart_items').insert({
        user_id: userId,
        product_id: productId,
        quantity
      });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return false;
  }
};

/**
 * Add item to cart by cart ID
 */
export const addToCartByCartId = async (
  cartId: string, 
  item: {
    product_id: string,
    quantity: number
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .upsert(
        {
          cart_id: cartId,
          product_id: item.product_id,
          quantity: item.quantity,
        },
        { onConflict: 'cart_id,product_id', ignoreDuplicates: false }
      )
      .select();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding item to cart by cart ID:', error);
    return false;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (
  itemId: string,
  quantity: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return false;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return false;
  }
};

/**
 * Clear cart by user ID
 */
export const clearCart = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

/**
 * Clear cart by cart ID
 */
export const clearCartByCartId = async (cartId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing cart by cart ID:', error);
    return false;
  }
};

/**
 * Subscribe to cart changes
 */
export const subscribeToCartChanges = (
  cartId: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel(`cart:${cartId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cart_items',
      filter: `cart_id=eq.${cartId}`
    }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
