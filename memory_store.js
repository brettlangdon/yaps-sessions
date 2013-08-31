var memory_store = function(){
    this.sessions = {};
};

memory_store.prototype.get = function(token){
    var session = this.sessions[token];
    var now = new Date().getTime();
    if(!session){
        return undefined;
    }
    if(session.expire && now > session.expire){
        this.sessions[token] = undefined;
        return undefined;
    }
    return session.value;
};

memory_store.prototype.set = function(token, value, ttl){
    if(!token){
        return;
    }
    var expire = 0;
    if(ttl){
        expire = new Date().getTime() + ttl;
    }
    var session = {
        expire: expire,
        value: value,
    };
    this.sessions[token] = session;
};

memory_store.prototype.delete = function(token){
    this.sessions[token] = undefined;
};

module.exports = memory_store;
