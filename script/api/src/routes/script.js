const fs = require('fs');
//TODO: use tranactions

module.exports = async function (httpRequest, httpResponse) {
  const { websiteId } = httpRequest.params;
  // check if website exists
  const response = await (new Core.Controller('websites')).get({ filters: { _id: websiteId } });
  if (response.status !== 200) return Middlewares.output(httpResponse, new Response('unknown website', 400));
  const website = response.content;
  //1- read the script
  const script = __dirname + '/../../../script/generic.js';
  fs.readFile(script, 'utf8', async (err, content) => {
    if (err) return Middlewares.output(httpResponse, new Response('internal error', 500));
    //2- set the value of the placeholder $websiteId, to get the right elements
    //! we only replace the first occurence (work well for now)
    content = content.replace('$websiteId', websiteId);
    try {
      //3- set the value of the placeholder $token, to pass auth and authorize middlewares
      let scriptUser = await getScriptUser({ company: website.company });
      if (!scriptUser) scriptUser = await createScriptUser({ company: website.company });
      content = content.replace('$token', scriptUser.authToken());
      //4- set the value of the placeholder $total
      //! it's a good idea to set limit to 1
      const total = await getTotalOfElements({ websiteId });
      content = content.replace('$total', total);
      return Middlewares.output(httpResponse, new Response(content, 200, { 'Content-type': 'text/javascript' }));
    } catch (err) { // error while searching for or creating [script-user|script-user-role]
      return Middlewares.output(httpResponse, new Response(err, 500));
    }
  });
}
async function getTotalOfElements({ websiteId }) {
  const response = await (new Core.Controller('elements')).search({
    filters: { website: websiteId }, options: { limit: 1 }
  });
  if (response.status !== 200) throw new Error(response.content);
  return response.content.total;
}
// company: object
async function getScriptUser({ company }) {
  const response = await (new Core.Controller('users')).get({
    filters: { company, email: `scriptuser${company}@gmail.com` }
  });
  if (response.status === 200) return response.content;
  else if (response.status === 404) return null;
  throw new Error(response.content);
}

async function getScriptUserRole({ company }) {
  const response = await (new Core.Controller('roles')).get({ filters: { company, name: `sur${company}` } });
  if (response.status === 200) return response.content;
  else if (response.status === 404) return null;
  throw new Error(response.content);
}

async function createScriptUserRole({ company }) {
  const role = await getScriptUserRole({ company });
  if (role) return role;
  const scriptUserRole = {
    name: `sur${company}`,
    permissions: [
      { module: 'elements', access: { read: true } }, // to get tracked elements
      { module: 'actions', access: { create: true } }, // to send tracking data
      { module: 'pageViews', access: { create: true } } // to send page views stat
    ],
    company: company.toString()
  };
  const response = await (new Core.Controller('roles')).create({ body: scriptUserRole });
  if (response.status === 200) return response.content;
  throw new Error(response.content);
}

async function createScriptUser({ company }) {
  const role = await createScriptUserRole({ company });
  const scriptUser = { firstName: 'script', lastName: 'user', email: `scriptuser${company}@gmail.com`, password: 'scriptUser', company: company.toString(), role: role._id.toString() };
  const response = await (new Core.Controller('users')).create({ body: scriptUser });
  if (response.status === 200) return response.content;
  throw new Error(response.content);
}

