import { CheckIn, Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

import { CheckinsRepository } from "./checkins-repository";
import { pagination } from "@/utils/paginations";

export class InMemoryCheckinsRepository implements CheckinsRepository {
  public items: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find(checkin => {
      const checkInDate = dayjs(checkin.created_at);
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkin.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) return null;

    return checkInOnSameDate;
  }

  async findManyByuserId(userId: string, page: number): Promise<CheckIn[]> {
    return pagination(this.items.filter(item => item.user_id === userId), page);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter(item => item.user_id === userId).length;
  }

  async findById(checkinId: string) {
    const checkin = this.items.find(item => item.id === checkinId);
    if (!checkin) return null;
    return checkin;
  }

  async create({ user_id, gym_id, validated_at }: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkin = {
      id: uuid(),
      user_id,
      gym_id,
      validated_at: validated_at ? new Date(validated_at) : null,
      created_at: new Date()
    };
    
    this.items.push(checkin);

    return checkin;
  }

  async save(checkin: CheckIn): Promise<CheckIn> {
    const checkinIndex = this.items.findIndex(item => item.id === checkin.id);

    if (checkinIndex >= 0) {
      this.items[checkinIndex] = checkin;
    }

    return checkin;
  }
  
}