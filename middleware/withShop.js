const {TEST_COOKIE_NAME, TOP_LEVEL_OAUTH_COOKIE_NAME} = require('../constants');

module.exports = function withShop({ authBaseUrl } = {}) {
  return function verifyRequest(request, response, next) {
    const { query: { shop, hmac }, session, baseUrl } = request;

    // clear old sessions
    if(hmac || (shop && session.shop && shop != session.shop)){
      request.session.shop = null
      request.session.accessToken = null
    }

    if (session && session.accessToken) {
      response.cookie(TOP_LEVEL_OAUTH_COOKIE_NAME);
      next();
      return;
    }

    response.cookie(TEST_COOKIE_NAME, '1');

    if (shop) {
      response.redirect(`${authBaseUrl || baseUrl}/auth?shop=${shop}`);
      return;
    }

    response.redirect('/install');
    return;
  };
};
