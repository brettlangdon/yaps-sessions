YAPS Sessions
============

Session manager for [YAPS](https://github.com/brettlangdon/yaps.git).

## Install
### Via NPM
```bash
npm install [-g] yaps-sessions
```

### Via Git
```bash
git clone git://github.com/brettlangdon/yaps-sessions.git
cd ./yaps-sessions.git
npm install
```

## Usage
```javascript
var yaps = require("yaps");
var yaps_sessions = require("yaps-sessions");

var app = new yaps.server();
app.registerPlugin(yaps_sessions);

var my_plugin = function(){
    this.GET("/", function(request, server, respond){
        // this is the cookie value being set
        request.session_token
        // this is the raw data stored in the session, DO NOT edit this manully
        // you MUST use request.sessionSet in order to trigger the data being saved
        request.session

        // save a new session value
        request.sessionSet("my-key", "some special value");
        // get the value back from the session this is the same as request.session.my-key
        request.sessionGet("my-key");

        respond(200, "your session data: " + JSON.stringify(request.session));
    });
};
app.registerPlugin(my_plugin);

app.start();
```

## Settings
```javascript
var yaps = require("yaps");
var yaps_sessions = require("yaps-sessions");

var app = new yaps.server({
    // this has to be an already initalized instance with the following methods
    // defaults to a built in `memory_store`, hint: do not use the built in store
    // it is good enough for testing, but does not provide any method of session
    // cleanup, meaning the session data for each user could potentially stay in memory
    // for EVER (until the server is restarted)
    //
    //     set: function(session_token, session_value, session_ttl)
    //          session_token: this is the session cookie value to store data for
    //          session_value: this is the raw session, e.g. {"my-key": "some session data"}
    //          session_ttl: number of seconds until this data is out of date
    //     get: function(session_token)
    //          session_token: the cookie value of the session to lookup
    //          returns: the raw session data as a js object, e.g. {"my-key": "some session data"}
    //     delete: function(session_token)
    //          session_token: this is the cookie value of the session to remove
    sessionStore: my_custom_store,

    // whether or not to regenerate a users session token on each request, default is false
    regenerateTokens: true,

    // method to use for generating user session tokens, default is uuid.v4()
    generateToken: function(){
        return "some super secret key";
    },

    // number of seconds until the session data should expire, default is 0 (keep forever)
    // the ttl is updated every time the session is set (for every call to request.sessionSet)
    sessionTTL: 3600,

    // the cookie to use to store the session token client side, default "sid"
    sessionCookie: "session_id",
});
app.start();
```

## License
```
The MIT License (MIT)

Copyright (c) 2013 Brett Langdon <brett@blangdon.com> (http://www.brett.is)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
