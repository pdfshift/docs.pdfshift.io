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

```ruby
require 'uri'
require 'net/https'
require 'json' # for hash to_json conversion

uri = URI("https://api.pdfshift.io/v2/convert/")
data = {"source" => "https://www.example.com"}

Net::HTTP.start(uri.host, uri.port, :use_ssl => true) do |http|
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    request.basic_auth 'your_api_key', ''

    response = http.request(request)

    if response.code == '200'
        # Since Ruby 1.9.1 only:
        File.binwrite("result.pdf", response.body)
    else
        # Handle other codes here
        puts "#{response.code} #{response.body}"
    end
end
```

```java
public static void main(String... args) throws Exception {
    var jsonObject = new JSONObject();
    jsonObject.put("source", "https://example.com");
    var httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://api.pdfshift.io/v2/convert"))
            .timeout(Duration.ofSeconds(20))
            .header("Content-Type", "application/json")
            .header("Authentication", "Basic " + "your_api_key")
            .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString()))
            .build();

    var httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofInputStream());

    var statusCode = response.statusCode();
    if (statusCode == 200 || statusCode == 201) {
        // Save the file locally
        var targetFile = new File("src/main/resources/targetFile.pdf");
        Files.copy(response.body(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } else {
        // error occurred
    }
}
```

```csharp
static void Main(string[] args)
{
    IRestClient client = new RestClient("https://api.pdfshift.io/v2/convert");
    client.Authenticator = new HttpBasicAuthenticator("your_api_key", "");

    IRestRequest request = new RestRequest(Method.POST);

    var json = new
    {
        source = "https://www.example.com"
    };
    request.AddJsonBody(json);

    IRestResponse response = client.Execute(request);
    if (!response.IsSuccessful)
    {
        // Check why status is not int 2xx.
    }
    else
    {
        File.WriteAllBytes("result.pdf", response.RawBytes);
    }
}
```

```go
package main

import (
    "bytes"
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
)

func main() {
    API_KEY := "your_api_key"

    message := map[string]interface{}{
        "source":  "https://example.com",
    }

    bytesRepresentation, err := json.Marshal(message)
    if err != nil {
        log.Fatalln(err)
    }

    client := http.Client{}
    request, err := http.NewRequest("POST", "https://api.pdfshift.io/v2/convert", bytes.NewBuffer(bytesRepresentation))
    if err != nil {
        log.Fatalln(err)
    }
    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Authorization", "Basic " + API_KEY)

    resp, err := client.Do(request)
    if err != nil {
        log.Fatalln(err)
    }

    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Fatalln(err)
        }
        // write the response to file
        ioutil.WriteFile("example.pdf", body, 0644)
    } else {
        // An error occurred
        var result map[string]interface{}

        json.NewDecoder(resp.Body).Decode(&result)

        log.Println(result)
        log.Println(result["data"])
    }
}
```


> The above command returns a PDF in binary format.

This endpoint the given URL to PDF.


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

```ruby
require 'uri'
require 'net/https'
require 'json' # for hash to_json conversion

uri = URI("https://api.pdfshift.io/v2/convert/")
data = { "source" => 'http://www.example.com',
    "filename" => "result.pdf" }

Net::HTTP.start(uri.host, uri.port, :use_ssl => true) do |http|
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    request.basic_auth 'your_api_key', ''

    response = http.request(request)

    if response.code == '200'
        puts response.body
        # { "duration":1309,
        # "filesize":37511,
        # "success":true,
        # "url":"<amazon_s3_url>/result.pdf"}
    else
        # Handle other codes here
        puts "#{response.code} #{response.body}"
    end
end
```

```java
public static void main(String... args) throws Exception {
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("source", "https://example.com");
    jsonObject.put("filename", "result.pdf");
    
    var httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://api.pdfshift.io/v2/convert"))
            .timeout(Duration.ofSeconds(20))
            .header("Content-Type", "application/json")
            .header("Authentication", "Basic " + "your_api_key")
            .POST(HttpRequest.BodyPublishers.ofFile(Paths.get("src/main/resources/body.json")))
            .build();

    var httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

    var statusCode = response.statusCode();
    if (statusCode == 200 || statusCode == 201) {
        // Response body is a json string. 
        var result = new JSONObject(response.body());
        System.out.println(result.get("url"));
    } else {
        // error occurred
    }
}
```

```csharp
static void Main(string[] args)
{
    IRestClient client = new RestClient("https://api.pdfshift.io/v2/convert");
    client.Authenticator = new HttpBasicAuthenticator("your_api_key", "");

    IRestRequest request = new RestRequest(Method.POST);

    var json = new
    {
        source = "https://www.example.com",
        filename = "result.pdf"
    };
    request.AddJsonBody(json);

    IRestResponse response = client.Execute(request);
    if (!response.IsSuccessful)
    {
        // Check why status is not int 2xx.
    }
    else
    {
        var jObject = JObject.Parse(response.Content);
        Console.WriteLine(jObject["url"].Value<string>());
    }
}
```

```go
package main

import (
    "net/http"
    "log"
    "encoding/json"
    "bytes"
    
)

func main() {
    API_KEY := "your_api_key"

    message := map[string]interface{}{
        "source": "https://example.com",
        "filename": "anotherExample.pdf",
    }

    bytesRepresentation, err := json.Marshal(message)
    if err != nil {
        log.Fatalln(err)
    }

    client := http.Client{}
    request, err := http.NewRequest("POST", "https://api.pdfshift.io/v2/convert", bytes.NewBuffer(bytesRepresentation))
    if err != nil {
        log.Fatalln(err)
    }
    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Authorization", "Basic " + API_KEY)

    resp, err := client.Do(request)
    if err != nil {
        log.Fatalln(err)
    }

    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        var result map[string]interface{}

        json.NewDecoder(resp.Body).Decode(&result)

        log.Println(result["url"])
    } else {
        // An error occurred
        var result map[string]interface{}

        json.NewDecoder(resp.Body).Decode(&result)

        log.Println(result)
    }
}
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

```ruby
require 'uri'
require 'net/https'
require 'json' # for hash to_json conversion

uri = URI("https://api.pdfshift.io/v2/convert/")
data = {"source" => "https://httpbin.org/basic-auth/user/passwd",
    "auth" => {
        "username" => "user",
        "password" => "passwd"
    } }

Net::HTTP.start(uri.host, uri.port, :use_ssl => true) do |http|
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    request.basic_auth 'your_api_key', ''

    response = http.request(request)

    if response.code == '200'
        # Since Ruby 1.9.1 only:
        File.binwrite("result.pdf", response.body)
    else
        # Handle other codes here
        puts "#{response.code} #{response.body}"
    end
end
```

```java
public static void main(String... args) throws Exception {
    var jsonObject = new JSONObject();
    jsonObject.put("source", "https://httpbin.org/basic-auth/user/passwd");

    var auth = new JSONObject();
    auth.put("username", "user");
    auth.put("password", "passwd");
    
    jsonObject.put("auth", auth);

    var httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://api.pdfshift.io/v2/convert"))
            .timeout(Duration.ofSeconds(20))
            .header("Content-Type", "application/json")
            .header("Authentication", "Basic " + "your_api_key")
            .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString()))
            .build();

    var httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofInputStream());

    var statusCode = response.statusCode();
    if (statusCode == 200 || statusCode == 201) {
        // Save the file locally
        var targetFile = new File("src/main/resources/targetFile.pdf");
        Files.copy(response.body(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } else {
        // error occurred
    }
}
```

```csharp
static void Main(string[] args)
{
    IRestClient client = new RestClient("https://api.pdfshift.io/v2/convert");
    client.Authenticator = new HttpBasicAuthenticator("your_api_key", "");

    IRestRequest request = new RestRequest(Method.POST);

    var json = new
    {
        source = "https://httpbin.org/basic-auth/user/passwd",
        auth = new { username = "user", password = "passwd" }
    };
    request.AddJsonBody(json);

    IRestResponse response = client.Execute(request);
    if (!response.IsSuccessful)
    {
        // Check why status is not int 2xx.
    }
    else
    {
        File.WriteAllBytes("result.pdf", response.RawBytes);
    }
}
```

```go
package main

import (
    "bytes"
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
)

func main() {
    API_KEY := "your_api_key"

    message := map[string]interface{}{
        "source": "https://httpbin.org/basic-auth/user/passwd",
        "auth": map[string]string{
            "username": "user",
            "password": "passwd",
        },
    }

    bytesRepresentation, err := json.Marshal(message)
    if err != nil {
        log.Fatalln(err)
    }

    client := http.Client{}
    request, err := http.NewRequest("POST", "https://api.pdfshift.io/v2/convert", bytes.NewBuffer(bytesRepresentation))
    if err != nil {
        log.Fatalln(err)
    }
    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Authorization", "Basic " + API_KEY)

    resp, err := client.Do(request)
    if err != nil {
        log.Fatalln(err)
    }

    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Fatalln(err)
        }
        // write the response to file
        ioutil.WriteFile("example.pdf", body, 0644)
    } else {
        var result map[string]interface{}

        json.NewDecoder(resp.Body).Decode(&result)

        log.Println(result)
    }
}
```


> The above command returns a PDF in binary format.

If your documents are located inside a protected area requiring a Basic Auth access, you can use the `auth` parameter from PDFShift's API to connect to your website.
Here's an example on how to do so.


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

```ruby
require 'uri'
require 'net/https'
require 'json' # for hash to_json conversion

uri = URI("https://api.pdfshift.io/v2/convert/")
data = {"source" => "https://httpbin.org/cookies",
    "cookies" => [{"name" => "session",
    "value" => "4cb496a8-a3eb-4a7e-a704-f993cb6a4dac" }] }

Net::HTTP.start(uri.host, uri.port, :use_ssl => true) do |http|
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    request.basic_auth 'your_api_key', ''

    response = http.request(request)

    if response.code == '200'
        # Since Ruby 1.9.1 only:
        File.binwrite("result.pdf", response.body)
    else
        # Handle other codes here
        puts "#{response.code} #{response.body}"
    end
end
```

```java
public static void main(String... args) throws Exception {
    var jsonObject = new JSONObject();
    jsonObject.put("source", "https://httpbin.org/cookies");

    var cookie = new JSONObject();
    cookie.put("name", "session");
    cookie.put("value", "4cb496a8-a3eb-4a7e-a704-f993cb6a4dac");

    var cookies = new JSONArray();
    cookies.put(cookie);

    jsonObject.put("cookies", cookies);

    var httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://api.pdfshift.io/v2/convert"))
            .timeout(Duration.ofSeconds(20))
            .header("Content-Type", "application/json")
            .header("Authentication", "Basic " + "your_api_key")
            .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString()))
            .build();

    var httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofInputStream());

    var statusCode = response.statusCode();
    if (statusCode == 200 || statusCode == 201) {
        // Save the file locally
        var targetFile = new File("src/main/resources/targetFile.pdf");
        Files.copy(response.body(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } else {
        // error occurred
    }
}
```

```csharp
static void Main(string[] args)
{
    IRestClient client = new RestClient("https://api.pdfshift.io/v2/convert");
    client.Authenticator = new HttpBasicAuthenticator("your_api_key", "");

    IRestRequest request = new RestRequest(Method.POST);

    var json = new
    {
        source = "https://httpbin.org/cookies",
        cookies = new object[] { new { name = "Session", value = "4cb496a8-a3eb-4a7e-a704-f993cb6a4dac" } }
    };
    request.AddJsonBody(json);

    IRestResponse response = client.Execute(request);
    if (!response.IsSuccessful)
    {
        // Check why status is not int 2xx.
    }
    else
    {
        File.WriteAllBytes("result.pdf", response.RawBytes);
    }
}
```

```go
package main

import (
    "net/http"
    "log"
    "encoding/json"
    "bytes"
    "io/ioutil"
    
)

func main() {
    API_KEY := "your_api_key"

    cookies := make([]map[string]string, 1)

    cookies[0] = make(map[string]string)
    cookies[0]["name"] = "session"
    cookies[0]["value"] = "4cb496a8-a3eb-4a7e-a704-f993cb6a4dac"

    message := map[string]interface{}{
        "source": "<html><head><title>Hello world</title><body><h1>Hello World</h1></body></head></html>",
        "cookies": cookies,
    }

    bytesRepresentation, err := json.Marshal(message)
    if err != nil {
        log.Fatalln(err)
    }

    client := http.Client{}
    request, err := http.NewRequest("POST", "https://api.pdfshift.io/v2/convert", bytes.NewBuffer(bytesRepresentation))
    if err != nil {
        log.Fatalln(err)
    }
    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Authorization", "Basic " + API_KEY)

    resp, err := client.Do(request)
    if err != nil {
        log.Fatalln(err)
    }

    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Fatalln(err)
        }
        // write the response to file
        ioutil.WriteFile("example.pdf", body, 0644)
    } else {
        var result map[string]interface{}

        json.NewDecoder(resp.Body).Decode(&result)

        log.Println(result)
    }
}
```

> The above command returns a PDF in binary format.

On the contrary, if your endpoint requires a more advanced authentication format, like a PHP session.
You can add cookies to the parameter to simulate an active session.

This can be easily done with the `cookies` parameter from our API.


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

```ruby
require 'uri'
require 'net/https'
require 'json' # for hash to_json conversion

uri = URI("https://api.pdfshift.io/v2/convert/")
data = {"source" => "https://www.example.com",
    'footer' => {
        'source' => '<div style="font-size: 12px">Page {{ "{{page}}" }} of {{ "{{total}}" }}</div>',
        'spacing' => '50px'
    } }

Net::HTTP.start(uri.host, uri.port, :use_ssl => true) do |http|
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    request.basic_auth 'your_api_key', ''

    response = http.request(request)

    if response.code == '200'
        # Since Ruby 1.9.1 only:
        File.binwrite("result.pdf", response.body)
    else
        # Handle other codes here
        puts "#{response.code} #{response.body}"
    end
end
```

```java
public static void main(String... args) throws Exception {
    var jsonObject = new JSONObject();
    jsonObject.put("source", "https://www.example.com");

    var footer = new JSONObject();
    footer.put("source", "<div style='font-size: 12px'>Page {{ "{{page}}" }} of {{ "{{total}}" }}</div>");
    footer.put("spacing", "50px");

    jsonObject.put("footer", footer);

    var httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://api.pdfshift.io/v2/convert"))
            .timeout(Duration.ofSeconds(20))
            .header("Content-Type", "application/json")
            .header("Authentication", "Basic " + "your_api_key")
            .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString()))
            .build();

    var httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofInputStream());

    var statusCode = response.statusCode();
    if (statusCode == 200 || statusCode == 201) {
        // Save the file locally
        var targetFile = new File("src/main/resources/targetFile.pdf");
        Files.copy(response.body(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } else {
        // error occurred
    }
}
```

```csharp
static void Main(string[] args)
{
    IRestClient client = new RestClient("https://api.pdfshift.io/v2/convert");
    client.Authenticator = new HttpBasicAuthenticator("your_api_key", "");

    IRestRequest request = new RestRequest(Method.POST);

    var json = new
    {
        source = "https://www.example.com",
        footer = new { source = "<div style=\"font-size: 12px\">Page {{ "{{page}}" }} of {{ "{{total}}" }}</div>", spacing = "50px" }
    };
    request.AddJsonBody(json);

    IRestResponse response = client.Execute(request);
    if (!response.IsSuccessful)
    {
        // Check why status is not int 2xx.
    }
    else
    {
        File.WriteAllBytes("result.pdf", response.RawBytes);
    }
}
```

```go
package main

import (
    "bytes"
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
)

func main() {
    API_KEY := "your_api_key"

    message := map[string]interface{}{
        "source": "https://www.example.com",
        "footer": map[string]string{
            "source": "<div style='font-size: 12px'>Page {{ "{{page}}" }} of {{ "{{total}}" }}</div>",
            "spacing": "50px",
        },
    }

    bytesRepresentation, err := json.Marshal(message)
    if err != nil {
        log.Fatalln(err)
    }

    client := http.Client{}
    request, err := http.NewRequest("POST", "https://api.pdfshift.io/v2/convert", bytes.NewBuffer(bytesRepresentation))
    if err != nil {
        log.Fatalln(err)
    }
    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Authorization", "Basic " + API_KEY)

    resp, err := client.Do(request)
    if err != nil {
        log.Fatalln(err)
    }

    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Fatalln(err)
        }
        // write the response to file
        ioutil.WriteFile("example.pdf", body, 0644)
    } else {
        var result map[string]interface{}

        json.NewDecoder(resp.Body).Decode(&result)

        log.Println(result)
    }
}
```

> The above command returns a PDF in binary format.

One frequent action when converting a web document to PDF is to add header and footer.
This is useful to add page number for instance, or the name of your company at the top of each pages.

This is easily done in PDFShift with the `header`/`footer` parameter.


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

```ruby
require 'uri'
require 'net/https'
require 'json'
require 'net/smtp'
require 'mail'
require 'sinatra'

get '/send' do
    generate_invoice
    send_invoice_via_email
    redirect to('/thank-you')
end

get '/thank-you' do
    'Check your email! thanks for using PDFShift!'
end

def generate_invoice
    file = File.read("invoice.html")
    uri = URI("https://api.pdfshift.io/v2/convert/")
    data = {"source" => file}

    Net::HTTP.start(uri.host, uri.port, :use_ssl => true) do |http|
        request = Net::HTTP::Post.new(uri.request_uri)
        request.body = data.to_json
        request["Content-Type"] = "application/json"
        request.basic_auth 'your_api_key', ''

        response = http.request(request)

        if response.code == '200'
            File.binwrite("result.pdf", response.body)
        else
            puts "#{response.code} #{response.body}"
        end
    end
end

def send_invoice_via_email
    # Update user_name and password with a valid gmail account
    options = { :address              => "smtp.gmail.com",
                :port                 => 587,
                :domain               => 'pdfshift.io',
                :user_name            => 'example@gmail.com',
                :password             => 'examplepassword',
                :authentication       => 'plain',
                :enable_starttls_auto => true }

    Mail.defaults do
        delivery_method :smtp, options
    end

    # Update the email fields to your needs
    Mail.deliver do
        from     'pdfshift-user@pdfshift.io'
        to       'recipient@domain.com'
        subject  'Your invoice'
        body     "Here's the invoice you requested"
        add_file 'result.pdf'
    end
end
```

```java
public static void main(String... args) throws Exception {
    byte[] encoded = Files.readAllBytes(Paths.get("src/main/resources/example.html"));
    String documentContent = new String(encoded, Charset.defaultCharset());

    var jsonObject = new JSONObject();
    jsonObject.put("source", documentContent);
    
    var httpRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://api.pdfshift.io/v2/convert"))
            .timeout(Duration.ofSeconds(10))
            .header("Content-Type", "application/json")
            .header("Authentication", "Basic " + "your_api_key")
            .POST(HttpRequest.BodyPublishers.ofString(jsonObject.toString()))
            .build();

    var httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();
    var response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofInputStream());

    var statusCode = response.statusCode();
    if (statusCode == 200 || statusCode == 201) {
        // save pdf to file targetFile.pdf
        var targetFile = new File("src/main/resources/targetFile.pdf");
        Files.copy(response.body(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        // Send pdf as email attachment
        var prop = new Properties();
        prop.put("mail.smtp.auth", true);
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.mailtrap.io");
        prop.put("mail.smtp.port", "25");
        prop.put("mail.smtp.ssl.trus", "smtp.mailtrap.io");

        var username = "get username from mailtrap.io";
        var password = "get password from mailtrap.io";

        var session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        var message = new MimeMessage(session);
        message.setFrom(new InternetAddress("from@gmail.com"));
        message.setRecipients(
                Message.RecipientType.TO, InternetAddress.parse("to@gmail.com")
        );
        message.setSubject("Mail Subject");

        var attachment = new File("src/main/resources/targetFile.pdf");

        var mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent("Just ignore this message", "text/plain");
        mimeBodyPart.attachFile(attachment);

        var multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);

        message.setContent(multipart);

        Transport.send(message);
    } else {
        System.out.println("Error occured");
    }
}
```

```csharp
static void Main(string[] args)
{
    IRestClient client = new RestClient("https://api.pdfshift.io/v2/convert");
    client.Authenticator = new HttpBasicAuthenticator("your_api_key", "");

    IRestRequest request = new RestRequest(Method.POST);
    string document_content = File.ReadAllText("invoice.html");
    var json = new
    {
        source = document_content,
        sandbox = true,
    };
    request.AddJsonBody(json);
    IRestResponse response = client.Execute(request);

    if (!response.IsSuccessful)
    {
        // Check why status is not int 2xx.
    }

    SmtpClient smtpClient = new SmtpClient();
    smtpClient.EnableSsl = true;
    NetworkCredential basicCredential = new NetworkCredential("YourMail", "YourPassword");
    MailMessage message = new MailMessage();
    MailAddress fromAddress = new MailAddress("billing@your-site.tld");

    // setup up the host, increase the timeout to 5 minutes
    smtpClient.Host = "smtp.gmail.com";
    smtpClient.UseDefaultCredentials = false;
    smtpClient.Credentials = basicCredential;
    smtpClient.Timeout = (60 * 5 * 1000);

    message.From = fromAddress;
    message.Subject = "Thank you for your purchase";
    message.IsBodyHtml = false;
    message.Body = File.ReadAllText("templates/emails/invoice.html");
    message.To.Add("customer@gmail.com");

    Attachment attachment;
    using (MemoryStream stream = new MemoryStream(response.RawBytes))
    {
        attachment = new Attachment(stream, "invoice.pdf");
        message.Attachments.Add(attachment);
    }

    smtpClient.Send(message);
}
```

```go
package main

import (
    "bytes"
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
    "net/mail"
    "net/smtp"

    "github.com/scorredoira/email"
)

func main() {
    API_KEY := "your_api_key"

    encoded, err := ioutil.ReadFile("example.html")
    if err != nil {
        log.Fatalln(err)
    }

    documentContent := string(encoded)

    message := map[string]interface{}{
        "source":  documentContent,
        "sandbox": true,
    }

    bytesRepresentation, err := json.Marshal(message)
    if err != nil {
        log.Fatalln(err)
    }

    client := http.Client{}
    request, err := http.NewRequest("POST", "https://api.pdfshift.io/v2/convert", bytes.NewBuffer(bytesRepresentation))
    if err != nil {
        log.Fatalln(err)
    }
    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Authorization", "Basic " + API_KEY)

    resp, err := client.Do(request)
    if err != nil {
        log.Fatalln(err)
    }

    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            log.Fatalln(err)
        }
                // write the response to file
                ioutil.WriteFile("example.pdf", body, 0644)

        // Send email
                m := email.NewMessage("Hi", "This is an example converted file")
                m.From = mail.Address{Name: "From", Address: "from@example.com"}
                m.To = []string{"to@example.com"}

                if err := m.Attach("example.pdf"); err != nil {
                    log.Fatalln(err)
                }

                auth := smtp.PlainAuth("", "c33e0593149230", "84d1dec05f668b", "smtp.mailtrap.io")
                if err := email.Send("smtp.mailtrap.io:2525", auth, m); err != nil {
                    log.Fatalln(err)
                }
    } else {
        // An error occurred
        var result map[string]interface{}

        json.NewDecoder(resp.Body).Decode(&result)

        log.Println(result)
        log.Println(result["data"])
    }
}
```

> The above command returns a PDF in binary format.

Here's a complete example of how PDFShift can be integrated in one of your project.

A frequent use case is to use PDFShift to convert a locally generated invoice made in HTML (displayed in the back-office of your customer), converted in PDF and then sent by email.
