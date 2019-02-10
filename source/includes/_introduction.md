# Introduction

Welcome to the PDFShift API. This documentation contains all the details needed to use the API and how to convert documents from HTML to PDF.

You will find code samples in Shell, Javascript, Python and PHP.

## Rate limiting

Rate limiting is only forced for unauthenticated accounts with a limit of 2 requests per minutes.

As soon as you are authenticated, the restriction is lifted and you can convert as many documents as you want.

When reaching the rate limit, you will get an HTTP status code of `429`.

Each request will contain three headers to let you know your usage:


`X-RateLimit-Remaining: 30`<br />
`X-RateLimit-Limit: 45`<br />
`X-RateLimit-Reset: 1466368960`<br />

| Key | Explanation |
| --- | --- |
| **X-RateLimit-Remaining** | Indicates the number of requests before hitting the rate limit. |
| **X-RateLimit-Reset** | Indicates the number of requests you can make per minutes (always 45). |
| **X-RateLimit-Reset** | Indicates when the rate limit will reset. |

## Errors

The Kittn API uses the following error codes:

Error Code | Meaning
---------- | -------
400 | Bad Request -- Your request is invalid.
401 | Unauthorized -- Your API key is wrong.
403 | Forbidden -- The kitten requested is hidden for administrators only.
404 | Not Found -- The specified kitten could not be found.
405 | Method Not Allowed -- You tried to access a kitten with an invalid method.
406 | Not Acceptable -- You requested a format that isn't json.
410 | Gone -- The kitten requested has been removed from our servers.
418 | I'm a teapot.
429 | Too Many Requests -- You're requesting too many kittens! Slow down!
500 | Internal Server Error -- We had a problem with our server. Try again later.
503 | Service Unavailable -- We're temporarily offline for maintenance. Please try again later.