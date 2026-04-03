function obtenirPagination(query) {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

module.exports = obtenirPagination;

