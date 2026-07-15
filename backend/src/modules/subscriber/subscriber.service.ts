import { SubscriberRepository } from "./subscriber.repository";
import { CreateSubscriberInput } from "./subscriber.schema";
import { BadRequestException } from "../../common/exceptions/HttpException";

export class SubscriberService {
  private subscriberRepository: SubscriberRepository;

  constructor() {
    this.subscriberRepository = new SubscriberRepository();
  }

  async subscribe(data: CreateSubscriberInput) {
    const existing = await this.subscriberRepository.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException("Email này đã được đăng ký nhận bản tin trước đó");
    }

    return this.subscriberRepository.create(data.email);
  }
}
