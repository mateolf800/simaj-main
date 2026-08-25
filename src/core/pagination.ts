import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PaginatableDelegate<T, Where, OrderBy> {
  findMany(args: {
    where: Where;
    orderBy: OrderBy;
    skip: number;
    take: number;
  }): Promise<T[]>;
  count(args: { where: Where }): Promise<number>;
}

export async function paginate<T, Where, OrderBy>(
  delegate: PaginatableDelegate<T, Where, OrderBy>,
  args: { where: Where; orderBy: OrderBy; page: number; limit: number },
): Promise<PaginatedResult<T>> {
  const { where, orderBy, page, limit } = args;

  const [data, total] = await Promise.all([
    delegate.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    delegate.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
