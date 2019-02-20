# Convert

## General

This is the main endpoint of the PDFShift's API.
The main idea is to pass a source document in HTML (either raw HTML or an URL) and get a PDF in return.

Many parameters are available to let you customize the resulting PDF to your needs.

### HTTP Request

`POST https://api.pdfshift.io/v2/convert`

### Parameters

Provide the parameters as a JSON object.

Parameter | Default | Description
--------- | ------- | -----------
source | **required** | Original document to convert to PDF. PDFShift will automatically detect if it's an URL and load it, or an HTML document and charge it.
sandbox | false | Will generates documents that doesn't count in the credits. The generated document will come with a watermark.
encode | false | Will return the generated PDF in Base64 encoded format, instead of raw.
timeout |  null | If provided, will kill the page loading at a specified time without stopping with a TimeoutError. Value in seconds
landscape | false | Will set the view in landscape mode instead of portrait
css | null | Will append this CSS styles to the document before saving it. Can be an URL or a String of CSS rules.
javascript | null | Will execute the given Javascript before saving the document. Can be an URL or a String of JS code.
disable_images | false | Images will not be included in the final document.
disable_javascript | false | Will not execute the javascript at all in the document
disable_links | false| The link in the document will not point anywhere.
disable_backgrounds | false | The final document will not have the background images.
delay | 0 | In milliseconds. Will wait for this duration before capturing the document. Up to 10 seconds max.
use_print | false | Use the print stylesheet instead of the general one.
format | A4 | Format of the document. You can either use the standard values (Letter, Legal, Tabloid, Ledger, A0, A1, A2, A3, A4, A5) or a custom `{width}x{height}` value. For {width} and {height}, you can indicate the following units: in, cm, mm.
viewport | 1200x1024 | Viewport size. Defined as `width x height`. Default is 1200x1024.
zoom | 1 | A value between 0 and 2. Allows you to increase the zoom in the document for specific purposes. 1 is the default zoom, lower is smaller, higher is bigger.
margin | null | Empty spaces between the outer and the beginning of the content
auth | null | Object containing `username` and `password` for accessing password-protected content.
cookies | null | List of cookies you want to send along with the requests when loading the source. See the related part at the bottom of the document
http_headers | null | List of http headers that you can customize for a better end result.
header | {"source": "&lt;div style="font-size: 12px"&gt;Pages {{page}} of {{total}}&lt;/div&gt;", "spacing": "150px"} | Defines a custom header. See the "Header/Footer" section for more details.
footer | null | Same as header.
protection | null | Will add restrictions on the PDF document. See the #Protection part for more details
watermark | null | Add a watermark to the generated document. See the #Watermark part for more details.


### Cookies

List of accepted parameters for the Cookie object.

Parameter | Default | Description
--- | --- | ---
name  | **required** | Name of the cookie
value | ** required ** | Value for the specified cookie
secure | false | If set to true, This cookie will only be available for secure (https) connections.
http_only | false | If set to true, this cookie will only be available to HTTP request only (no javascript).


### Margin

You can define margin for the document (space between the limits of the document and the beginning of the content).
You can either pass an object as defined below, or use a CSS like string, like the following:

* **`10px`**: Will set a margin of 10px for all four borders.
* **`10px 0`**: Will set a margin of 10px for top and bottom, and a margin of 0 for left and right.
* **`10px 0 20px`**: Will set a margin of 10px for top, 0 for left and right and 20px for the bottom.
* **`10px 20px 30px 40px`**: Will set a margin of 10px for top, 20px for right, 30px for bottom and 40px for left.

Otherwise, you can use an object to directly target a specific margin, using the following:

Parameter | Default | Description
--- | --- | ---
top | null | Space between the top and the content.
right | null | Space between the right and the content.
bottom | null | Space between the bottom and the content.
left | null | Space between the left and the content.


### Header/Footer

You can configure the aspect of your header and footer document using the following values.

<aside class="notice">
The footer and header are <strong>independant</strong> from the rest of the document.<br />
<br />
As such, the CSS style defined in your body won't apply on your header/footer.<br />
To style your header/footer, you need to set a specific style either using &lt;style&gt; tag first, or adding <code>style=""</code> on your DOM elements.
</aside>

Parameter | Default | Description
--- | --- | ---
source | null | Element to add in the header/footer part of the document. You can use variables, indicated at the end of the document. PDFShift will automatically detect if it's an URL and load it, or an HTML data and charge it.
spacing | null | A spacing between the header or footer and the content. For header, it's the space between the header and the beginning of the document. For the footer, it's the space between the end of the document and the bottom of the page.

#### Header/Footer variables

Variable | Description
--- | ---
**{{date}}** | Formatted print date
**{{title}}** | Title of the HTML document
**{{url}}** | Page URL
**{{page}}** | Current page
**{{total}}** | Total number of pages


### Protection

You can restrict access to your generated document using the following rules. The encryption is made in 128bits.

<aside class="warning">
Some PDF Reader don't make the distinction between <strong>user</strong> and <strong>owner</strong> in a PDF Document.
This means that when the user password has been entered, some PDF reader ignore the restrictions (no print, no copy, etc).<br />
<br />
So, setting a blank password for the user is similar to no security.
</aside>

Parameter | Default | Description
--- | --- | ---
author | null | Document's author name
user_password | null | A user who has the password will be able to view the document and perform operations allowed by the permission options
owner_password | null | A user who has the password will have unlimited access to the PDF, including changing the passwords and permission options.
no_print | false | When set to true, printing will be disabled.
no_copy | false | When set to true, the possibility to copy any text will be disabled.
no_modify | false | When set to true, the possibility to modify the document will be disabled.


### Watermark

Adding a watermark to your document is easy with PDFShift.

image:
text:


### Misc

When converting a document, if successful, the HTTP response from PDFShift's API will contain the following header:

Header | Description
--- | --- | ---
X-Response-StatusCode | The status code from your URL source, when an URL is provided. This can be useful to ensure the URL worked correctly.


## Use cases


### Converting an URL

```javascript
const pdfshift = require('pdfshift')('your_api_key');
const fs = require('fs');

pdfshift.convert('https://www.example.com').then(function (binary_file) {
    fs.writeFile('result.pdf', binary_file, "binary", function () {})
}).catch(function({message, code, response, errors = null}) {})
```

```php
<?php
// Using the function at 
// https://gist.github.com/cnicodeme/f2c73d89ac49313d023d738b5cdb7046

$response = pdfshift('your_api_key_here', array (
    'source' => 'https://www.example.com'
));

file_put_contents('result.pdf', $response);
```

```python
import requests

response = requests.post(
    'https://api.pdfshift.io/v2/convert',
    auth=('your_api_key_here', ''),
    json={'source': 'https://www.example.com'},
    stream=True
)

response.raise_for_status()

with open('result.pdf', 'wb') as output:
    for chunck in response.iter_content(chunck_size=1024):
        output.write(chunck)
```


> The above command returns a PDF in binary format.

This endpoint the given URL to PDF.

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

### Saving the document to Amazon S3

```javascript
const pdfshift = require('pdfshift')('your_api_key');
const fs = require('fs');

pdfshift.convert('https://www.example.com', {filename: 'result.pdf'}).then(function (body) {
    let json = JSON.parse(body);
    // The URL is on 
    console.log(json.url);
}).catch(function({message, code, response, errors = null}) {})
```

```php
<?php
$response = pdfshift('your_api_key_here', array (
    'source' => 'https://www.example.com',
    'filename' => 'result.pdf'
));

$json = json_decode($response, true);
// The URL is at $json['url'];
```

```python
import requests

response = requests.post(
    'https://api.pdfshift.io/v2/convert',
    auth=('your_api_key_here', ''),
    json={
        'source': 'https://www.example.com',
        'filename': 'result.pdf'
    }
)

response.raise_for_status()

json_response = response.json()
# The URL to the document is at json_response['url]
```

> The above command returns JSON structured like this:

```json
{
  "success": true,
  "url": "https://s3.amazonaws.com/pdfshift/d/2/2019-02/47fc3918791a4818a6bf655cfb63c96e/result.pdf",
  "filesize": 13370,
  "duration": 5
}
```

By passing the "filename" parameter, the endpoint won't return the binary PDF, but an URL from Amazon S3 where the document will be stored for 2 days before being automatically deleted.

This can be useful if you don't want to download a large PDF to your server to then serve it to your users, but instead redirect them directly to that document.

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

### Accessing secured pages

```javascript
const pdfshift = require('pdfshift')('your_api_key');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://httpbin.org/basic-auth/user/passwd')
    .auth('user', 'passwd')
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

```php
<?php
$response = pdfshift('your_api_key_here', array (
    'source' => 'https://httpbin.org/basic-auth/user/passwd',
    'auth' => array (
        'username' => 'user',
        'password' => 'passwd'
    )
));

file_put_contents('result.pdf', $response);
```

```python
import requests

response = requests.post(
    'https://api.pdfshift.io/v2/convert',
    auth=('your_api_key_here', ''),
    json={
        'source': 'https://httpbin.org/basic-auth/user/passwd',
        'auth': {
            'username': 'user',
            'password': 'passwd'
        }
    },
    stream=True
)

response.raise_for_status()

with open('result.pdf', 'wb') as output:
    for chunck in response.iter_content(chunck_size=1024):
        output.write(chunck)
```


> The above command returns a PDF in binary format.

If your documents are located inside a protected area requiring a Basic Auth access, you can use the `auth` parameter from PDFShift's API to connect to your website.
Here's an example on how to do so.

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

### Using Cookies

```javascript
const pdfshift = require('pdfshift')('your_api_key');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://httpbin.org/cookies')
    .addCookie({name: 'session', value: '4cb496a8-a3eb-4a7e-a704-f993cb6a4dac'})
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

```php
<?php
$response = pdfshift('your_api_key_here', array (
    'source' => 'https://httpbin.org/cookies',
    'cookies' => array ('name' => 'session', 'value' => '4cb496a8-a3eb-4a7e-a704-f993cb6a4dac')
));

file_put_contents('result.pdf', $response);
```

```python
import requests

response = requests.post(
    'https://api.pdfshift.io/v2/convert',
    auth=('your_api_key_here', ''),
    json={
        'source': 'https://httpbin.org/cookies',
        'cookies': {'name': 'session', 'value': '4cb496a8-a3eb-4a7e-a704-f993cb6a4dac'}
    },
    stream=True
)

response.raise_for_status()

with open('result.pdf', 'wb') as output:
    for chunck in response.iter_content(chunck_size=1024):
        output.write(chunck)
```

> The above command returns a PDF in binary format.

On the contrary, if your endpoint requires a more advanced authentication format, like a PHP session.
You can add cookies to the parameter to simulate an active session.

This can be easily done with the `cookies` parameter from our API.

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

### Adding a custom footer

```javascript
const pdfshift = require('pdfshift')('your_api_key');
const fs = require('fs');

// We use .prepare() instead of .convert to easily handle advanced configuration
pdfshift.prepare('https://www.example.com')
    .footer({source: '<div>Page {{page}} of {{total}}</div>', spacing: '50px'})
    .convert()
    .then(function (binary_file) {
        fs.writeFile('result.pdf', binary_file, "binary", function () {})
    })
    .catch(function({message, code, response, errors = null}) {})
```

```php
<?php
$response = pdfshift('your_api_key_here', array (
    'source' => 'https://www.example.com',
    'footer' => array (
        'source' => '<div style="font-size: 12px">Page {{ "{{page}}" }} of {{ "{{total}}" }}</div>',
        'spacing' => '50px'
    )
));

file_put_contents('result.pdf', $response);
```

```python
import requests

response = requests.post(
    'https://api.pdfshift.io/v2/convert',
    auth=('your_api_key_here', ''),
    json={
        'source': 'https://www.example.com',
        'footer': {
            'source': '<div style="font-size: 12px">Page {{ "{{page}}" }} of {{ "{{total}}" }}</div>',
            'spacing': '50px'
        }
    },
    stream=True
)

response.raise_for_status()

with open('result.pdf', 'wb') as output:
    for chunck in response.iter_content(chunck_size=1024):
        output.write(chunck)
```

> The above command returns a PDF in binary format.

One frequent action when converting a web document to PDF is to add header and footer.
This is useful to add page number for instance, or the name of your company at the top of each pages.

This is easily done in PDFShift with the `header`/`footer` parameter.

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />


### Sending an invoice by email

```javascript
const express = require('express');
const fs = require('fs');
const nodemail = require('nodemailer');
const pdfshift = require('pdfshift')('your_api_key');

const app = express();

app.get('/send/',  (req, res, next) => {
    let invoice = fs.readFileSync('invoice.html', 'utf8');

    pdfshift.convert(invoice).then(function (binary_pdf) {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        let mailOptions = {
            from: '"Billing at Your-Site" <billing@your-site.tld>',
            to: "customer@gmail.com"
            subject: "Thank you for your purchase",
            text: fs.readFileSync('templates/emails/invoice.txt', 'utf8'),
            html: fs.readFileSync('templates/emails/invoice.html', 'utf8'),
            attachments: [
                {
                    filename: 'invoice.pdf',
                    contentType: 'application/pdf',
                    content: binary_pdf
                }
            ]
        };

        // send mail with defined transport object
        await transporter.sendMail(mailOptions)

        // Then, we redirect
        res.redirect(301, '/thank-you');
    }).catch(function({message, code, response, errors = null}) {})
})
```

```php
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'path/to/PHPMailer/src/Exception.php';
require 'path/to/PHPMailer/src/PHPMailer.php';
require 'path/to/PHPMailer/src/SMTP.php';

$source = file_get_contents('invoice.html');

$binary_pdf = pdfshift('your_api_key_here', array (
    'source' => $source
));

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp1.example.com;smtp2.example.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'billing@your-site.tld';
    $mail->Password = 'secret';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('billing@your-site.tld', 'Billing at Your-Site');
    $mail->addAddress('customer@gmail.com', 'John Doe');

    // Body of the email
    $mail->isHTML(true);
    $mail->Subject = 'Thank you for your purchase';
    $mail->Body    = file_get_contents('templates/emails/invoice.html');
    $mail->AltBody = file_get_contents('templates/emails/invoice.txt');

    // Add the invoice from PDFShift:
    $mail->addStringAttachment($binary_pdf, 'invoice.pdf', 'base64', 'application/pdf');

    $mail->send();
    return redirect('/thank-you');
} catch (Exception $e) {
    // Manage exception
}
```

```python
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import redirect
import requests

document = open('invoice.html', 'r')
document_content = document.read()
document.close()

response = requests.post(
    'https://api.pdfshift.io/v2/convert',
    auth=('your_api_key_here', ''),
    json={'source': document_content}
)

response.raise_for_status()

text_content = None
with open('templates/emails/invoice.txt', 'r') as f:
    text_content = f.read()

html_content = None
with open('templates/emails/invoice.html', 'r') as f:
    html_content = f.read()

msg = EmailMultiAlternatives("Thank you for your purchase", text_content, 'billing@your-site.tld', ['customer@gmail.com'])
msg.attach_alternative(html_content, "text/html")
msg.attach('invoice.pdf', response.content, 'application/pdf')
msg.send()

return redirect('/thank-you')
```

> The above command returns a PDF in binary format.

Here's a complete example of how PDFShift can be integrated in one of your project.

A frequent use case is to use PDFShift to convert a locally generated invoice made in HTML (displayed in the back-office of your customer), converted in PDF and then sent by email.
