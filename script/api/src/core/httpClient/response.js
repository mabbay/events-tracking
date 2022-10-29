
module.exports = class Response {
    constructor(content = null, status = 200, headers = {}) {
        this.content = content;
        this.status = status;
        this.headers = headers;
    }
    send(res) {
        return res.header(this.headers).status(this.status).send(this.content);
    }
    getContent() {
        return this.content;
    }
    setContent(content) {
        this.content = content;
    }
    setStatus(status) {
        this.status = status;
    }
    getStatus() {
        return this.status;
    }
    // headers: like {'Content-Type': 'text/html', 'x-auth-token': 'xyz', ...}
    setHeaders(headers) { 
        // why merging ? in case we call this method more than once
        Object.assign(this.headers, headers);
    }
    addHeader(header) { // header like: {'Content-Type': 'text/html'}
        const [key, value] = Object.entries(header)[0];
        this.headers[key] = value;
    }
}