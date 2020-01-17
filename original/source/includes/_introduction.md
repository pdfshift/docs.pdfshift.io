# Introduction

Welcome to the PDFShift API. This documentation contains all the details needed to use the API and how to convert documents from HTML to PDF.

You will find code samples in Shell, Javascript, Python and PHP.

## Getting an API Key

In order to generate PDF without the PDFShift's watermark, you will need an API Key.
You can request one by creating an account on [PDFShift's website](https://pdfshift.io/register/).

Once you have submitted the form, we will send you an email containing your API Key.
You can also create other API Key if you want, to split your keys accross your project.
This can be done via your [Dashboard](https://pdfshift.io/account/dashboard/).

You can test and play with our API without an API Key. Simply don't provide a "Basic Auth" header and the request will be done, with the difference that a watermark will be applied to the document.
Note that applying a watermark makes the generation slower, so you will have better result when using your API Key.


## Authentication

Authenticate your account by including your secret key in API requests. You can manage your API keys in the [Dashboard](https://pdfshift.io/account/dashboard/).

Authentication to the API is performed via [HTTP Basic Auth](http://en.wikipedia.org/wiki/Basic_access_authentication).
Provide your API key as the basic auth username value. The password is ignored and can be set to whatever you want (an empty string works fine).

`Authorization: Basic your_api_key:`


## Rate limiting

Rate limiting is only forced for **unauthenticated accounts** with a limit of 2 requests per minutes.

As soon as you are authenticated, the restriction is lifted and you can convert as many documents as you want.

When reaching the rate limit, you will get an HTTP status code of `429`.

Each request will contain three headers to let you know your usage:

```
# HTTP response from PDFShift's API will contain these three headers:

X-RateLimit-Remaining: 30
X-RateLimit-Limit: 45
X-RateLimit-Reset: 1466368960
```

| Key | Explanation |
| --- | --- |
| **X-RateLimit-Remaining** | Indicates the number of requests before hitting the rate limit. |
| **X-RateLimit-Reset** | Indicates the number of requests you can make per minutes (always 45). |
| **X-RateLimit-Reset** | Indicates when the rate limit will reset. |

## Errors

The PDFShift API uses the following error codes:

Error Code | Meaning
---------- | -------
400 | Bad Request -- Your request is invalid. Often, it means a parameter was wrongly set.
401 | Unauthorized -- No API key were found.
403 | Forbidden -- The provided API key is invalid.
404 | Not Found -- The page you tried to reach was not found.
405 | Method Not Allowed -- The endpoint you tried to reach is not available with this HTTP method.
408 | A timeout error occured when trying to convert a document.
429 | Too Many Requests -- You sent too many request. Please see the [Rate limiting](#rate-limiting) section for more details.
500 | Internal Server Error -- We had a problem with our server. Try again later.