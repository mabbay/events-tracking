// this middleware will be called when accessing elements module
module.exports = async (req) => {
  const { user } = req.session, { action } = req.params;

  if (['get', 'update', 'delete'].includes(action)) {
    if (!req.filters._id && !req.filters.id)  return new Response('element id is missing', 400);
    else return new Response();
  }
  // if create we expect website in body, 
  // if search we expect it in filters
  let website;
  if (action === 'create') website = req.body.website;
  else website = req.filters.website;
  if (!website) return new Response('website missing', 400);
  // check if the website exists & owned by the company the user bleongs to  
  const filters = { _id: website, company: user.company };
  const response = await (new Core.Controller('websites')).get({ filters });
  // something went wrong (website not found for example or not owned by the company) 
  if (response.getStatus() != 200) return response;
  return new Response();
}
//MIN REQUIREMENTS
// create: website in req body
// get, update & delete: element id in filters