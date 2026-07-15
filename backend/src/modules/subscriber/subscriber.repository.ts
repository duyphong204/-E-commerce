import Subscriber from "../../models/Subscriber";

export class SubscriberRepository {
  async findByEmail(email: string) {
    return Subscriber.findOne({ email });
  }

  async create(email: string) {
    return Subscriber.create({ email });
  }
}
