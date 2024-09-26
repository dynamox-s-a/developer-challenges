import { IFilter, PaginatedDTO } from "../shared/utils/IFilter";

export async function paginatedResults(filter: IFilter, model: any) {
  //gets the query from URI
  const { populate, page, limit, value, order, orderBy, select } = filter;
  const sort = orderBy ? { [orderBy]: order } : {};
  // sets the limits

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // gets the total response length to show the full spectrum in the DB
  const count = await model.countDocuments(value).exec();
  //sets the maximum number of pages the API response can generate
  // const limitPage = count / limit;

  //creates the new result to send page
  const results: PaginatedDTO = {
    count,
    next: endIndex < count ? Number(page) + 1 : 0,
    previous: startIndex > 0 ? Number(page) - 1 : 0,
    resultData: await model
      .find(value)
      .limit(limit)
      .skip(startIndex)
      .populate(populate ? populate : "")
      .select(select)
      .sort(sort)
      .exec(),
  };

  return Promise.resolve(results);
}
