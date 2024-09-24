import { CheckIn, Prisma } from "@prisma/client";

export interface CheckinsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkin: CheckIn): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  countByUserId(userId: string): Promise<number>;
  findManyByuserId(userId: string, page: number): Promise<CheckIn[]>;
  findById(checkinId: string): Promise<CheckIn |  null>;
}