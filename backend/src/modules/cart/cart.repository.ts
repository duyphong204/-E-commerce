import Cart from "../../models/Cart";

export class CartRepository {
  async findByUserId(userId: string) {
    return Cart.findOne({ user: userId });
  }

  async findByGuestId(guestId: string) {
    return Cart.findOne({ guestId });
  }

  async create(cartData: any) {
    return Cart.create(cartData);
  }

  async deleteByGuestId(guestId: string) {
    return Cart.findOneAndDelete({ guestId });
  }

  async updateById(id: string, cartData: any) {
    return Cart.findByIdAndUpdate(id, cartData, { new: true });
  }
}
