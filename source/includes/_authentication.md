# Authentication

Authenticate your account by including your secret key in API requests. You can manage your API keys in the [Dashboard](https://pdfshift.io/account/dashboard/).

Authentication to the API is performed via [HTTP Basic Auth](http://en.wikipedia.org/wiki/Basic_access_authentication).
Provide your API key as the basic auth username value. The password is ignored and can be set to whatever you want (an empty string works fine).

`Authorization: Basic your_api_key:`
