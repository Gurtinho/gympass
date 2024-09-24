import { Prisma, CheckIn } from "@prisma/client";
import { CheckinsRepository } from "../checkins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";


export class PrismaCheckinsRepository implements CheckinsRepository {

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkin = await prisma.checkIn.create({
      data
    });

    return checkin;
  }

  async save(checkin: CheckIn): Promise<CheckIn> {
    const checkinCreated = await prisma.checkIn.update({
      where: {
        id: checkin.id
      },
      data: checkin,
    });

    return checkinCreated;
  }
  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    // usar o findfirst pra pegar o primeiro item q bate com pedido
    const checkin = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(), // grand then equal
          lte: endOfTheDay.toDate() // less than equal
        }
      }
    });

    return checkin;
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    });

    return count;
  }

  async findManyByuserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkins = await prisma.checkIn.findMany({
      where: {
        user_id: userId
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkins;
  }

  async findById(checkinId: string): Promise<CheckIn | null> {
    const checkin = await prisma.checkIn.findUnique({
      where: {
        id: checkinId
      }
    });

    return checkin;
  }
  
}