module.exports = class Controller extends Core.Controller {
  constructor() {
    super('pageViews');
  }

  // TODO add origin verification
  // TODO also from origin header, get the website id (now it's required from the sender, which is not secure)
  async create(req) {
    // validation
    const { schema: pageViewSchema, Joi } = new Components.pageViews.Validation;
    const schema = Joi.array().items(pageViewSchema);
    const { pageViews: pagesViews } = req.body;
    const { error } = schema.validate(pagesViews);
    if (error) return new Response('invalid data', 400);
    // verify if website exists
    const websiteId = pagesViews[0].website;
    const response = await (new Components.websites.Controller).get({
      filters: { _id: websiteId, company: req.session.user.company }
    });
    if (response.getStatus() !== 200) return new Response('invalid data', 400);
    // set the company
    const website = response.content;
    pagesViews.forEach(pageView => { pageView.company = website.company });
    // store data
    const res = await (new Core.Repository(this.Model)).bulkCreate(pagesViews);
    if (res.errors) return new Response('internal error', 500); // we did all validation, so 500 makes sense
    return new Response();
  }
}