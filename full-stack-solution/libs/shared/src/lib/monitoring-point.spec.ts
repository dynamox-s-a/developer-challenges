import { listMonitoringPointsQuerySchema } from "./monitoring-point";

describe("listMonitoringPointsQuerySchema", () => {
  it("applies defaults: first page, 5 items, sorted by machine name", () => {
    expect(listMonitoringPointsQuerySchema.parse({})).toEqual({
      page: 1,
      pageSize: 5,
      sortBy: "machineName",
      order: "asc",
    });
  });

  it("coerces query-string values to numbers", () => {
    expect(
      listMonitoringPointsQuerySchema.parse({ page: "3", pageSize: "2" }),
    ).toMatchObject({ page: 3, pageSize: 2 });
  });

  it.each([
    { sortBy: "banana" },
    { order: "sideways" },
    { page: "0" },
    { pageSize: "0" },
    { pageSize: "51" },
  ])("rejects %p", (query) => {
    expect(listMonitoringPointsQuerySchema.safeParse(query).success).toBe(
      false,
    );
  });
});
