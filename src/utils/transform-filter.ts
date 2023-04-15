const transformFilter = (query, allowedKeys) => {
  let filter: any = {};

  const invalidKeys = Object.keys(query).filter((key) => !allowedKeys.includes(key));
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid allowed keys`);
  }

  let orClauses = [];

  Object.keys(query).forEach((key) => {
    if (allowedKeys.includes(key)) {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]];
      let clause = {};
      clause[key] = { $in: values };
      orClauses.push(clause);
    }
  });

  if (orClauses.length > 0) {
    filter.$or = orClauses;
  }

  return filter;
}

export { transformFilter }