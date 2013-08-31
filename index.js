var cookie = require("cookie");
var uuid = require("uuid");

var memory_store = require("./memory_store.js");

var sessions = function(options){
    this.settings = options || {};
    this.settings.sessionCookie = this.settings.sessionCookie || "sid";
    this.settings.regenerateTokens = this.settings.regenerateTokens || false;
    this.settings.sessionTTL = this.settings.sessionTTL || 0;
    this.generateToken = this.settings.generateToken || uuid.v4;
    this.sessions = options.sessionStore || new memory_store();

    this.on("setup", this.on_setup);
};

sessions.prototype.on_setup = function(request, server, done){
    var self = this;
    request.session_token = this.getSessionToken(request);
    request.session = this.getSession(request.session_token);

    // regenerate the user session token per request
    if(this.settings.regenerateTokens){
        var old_token = request.session_token;
        request.session_token = this.generateToken();
        this.sessions.delete(old_token);
        this.sessions.set(request.session_token, request.session, this.settings.sessionTTL);
    }

    request.sessionGet = function(key){
        request.session = request.session || {};
        return request.session[key];
    };

    request.sessionSet = function(key, value){
        request.session = request.session || {};
        request.session[key] = value;
        self.sessions.set(request.session_token, request.session, self.settings.sessionTTL);
    };

    request.addHeader("Set-Cookie", cookie.serialize(
        this.settings.sessionCookie,
        request.session_token
    ));
    done();
};

sessions.prototype.getSessionToken = function(request){
    var cookies = request.cookies || cookie.parse(request.headers.cookie || "");
    request.session_token = cookies[this.settings.sessionCookie];
    if(!request.session_token){
        request.session_token = this.generateToken();
        this.sessions.set(request.session_token, {}, this.settings.sessionTTL);
    }
    return request.session_token;
};

sessions.prototype.getSession = function(token){
    return this.sessions.get(token);
};

module.exports = sessions;
