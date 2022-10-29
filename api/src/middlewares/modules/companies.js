// this middleware will be called when accessing companies module
// actions that can be done on companies are: get, search, update and delete
// so, we only to set req.filters._id to user.company
// and delete company from req.filters, because it wa set by the authorize middleware function
module.exports = async (req) => {
  const { user } = req.session;
  req.filters._id = user.company;
  delete req.filters.company;

  return new Response();
}