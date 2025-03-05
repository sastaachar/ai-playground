const headers = {
  'Access-Control-Allow-Credentials': 'true',
  'access-control-allow-origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
};

export const allowCors = fn => async (req, res) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: headers,
    })
  }
  return await fn(req, res)
}