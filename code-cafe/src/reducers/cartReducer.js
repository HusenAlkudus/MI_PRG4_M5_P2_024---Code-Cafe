export const initialCartState = [];

const findItem = (cart, itemId) => (
  cart.find((item) => item.itemId === itemId)
);

// Pastikan CartTypes diekspor dengan benar
export const CartTypes = {
  ADD: 'ADD',
  EMPTY: 'EMPTY',
  REMOVE: 'REMOVE',
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    // Pastikan menggunakan CartTypes.ADD, BUKAN 'add' atau 'ADD' (string biasa)
    case CartTypes.ADD:
      if (findItem(state, action.itemId)) {
        return state.map((item) => (
          item.itemId === action.itemId
            ? {
              ...item,
              quantity: item.quantity + 1,
            }
            : item
        ));
      }
      return [
        ...state,
        {
          itemId: action.itemId,
          quantity: 1,
        },
      ];

    case CartTypes.EMPTY:
      return [];
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};
