// this middleware will be called when accessing users module
module.exports = async (req) => {
  const { user } = req.session, { action } = req.params;
  const update = (action === 'update'), read = (action === 'search' || action === 'get'),
    invite = (action === 'invite');
  const admin = (user.isAdmin === true);
  const noIdInFilters = !req.filters._id;
  
  //! for now an admin has an account for each company he owns
  //! we will make user id + company id an index, so a user can be associated with many companies
  //? but if a user want to sign up, should we ask him the name of the company ?

  // we can't change the company
  if (update) delete req.body.company;
  // a non admin user can't make another user admin also can't affect another role than his
  if (invite && !admin) {
    delete req.body.isAdmin;
    if (req.body.role) req.body.role = user.role;
  }
  // a non admin user can update only his account (of course if he has permission)
  if (update && !admin) {
    req.filters._id = user._id; delete req.body.role; delete req.body.isAdmin;
  }
  // we don't want to update a random user
  if (update && admin && noIdInFilters) req.filters._id = user._id;
  // we don't want to get a random user
  if (action === 'get' && noIdInFilters) req.filters._id = user._id;

  return new Response();
}