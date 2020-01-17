# Credits

## Credits status

> Sending a GET request to the credits endpoint returns JSON structured like this:

```json
{
  "total": 1000,
  "used": 150,
  "remaining": 850
}
```


Simply send a GET request toward `https://api.pdfshift.io/v2/credits/` to know in details your credits usage for your account.

Don't forget to set your API key as "Basic auth".


### HTTP Request

`GET https://api.pdfshift.io/v2/credits/`

