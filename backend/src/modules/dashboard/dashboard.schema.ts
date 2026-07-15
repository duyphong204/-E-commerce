import { z } from "zod";

export const getDashboardStatsSchema = z.object({
  query: z.object({
    timeRange: z.enum(["daily", "monthly", "yearly"]).optional().default("daily"),
  })
});

export type GetDashboardStatsQuery = z.infer<typeof getDashboardStatsSchema>["query"];
