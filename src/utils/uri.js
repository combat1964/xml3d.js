/**
 * Class URI
 * @constructor
 * @param {string} str The URI as string
 */
XML3D.URI = function(str) {
    str = str || "";
    // Based on the regex in RFC2396 Appendix B.
    var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
    var result = str.match(parser);
    /**  @type {boolean} */
    this.valid = result != null;
    /**  @type {?string} */
    this.scheme = result[1] || null;
    /**  @type {?string} */
    this.authority = result[2] || null;
    /**  @type {?string} */
    this.path = result[3] || null;
    /**  @type {?string} */
    this.query = result[4] || null;
    /**  @type {?string} */
    this.fragment = result[5] || null;
};

// Restore the URI to it's stringy glory.
XML3D.URI.prototype.toString = function() {
    var str = "";
    if (this.scheme) {
        str += this.scheme + ":";
    }
    if (this.authority) {
        str += "//" + this.authority;
    }
    if (this.path) {
        str += this.path;
    }
    if (this.query) {
        str += "?" + this.query;
    }
    if (this.fragment) {
        str += "#" + this.fragment;
    }
    return str;
};

// Restore the URI to it's stringy glory.
XML3D.URI.prototype.toStringWithoutFragment = function() {
    var str = "";
    if (this.scheme) {
        str += this.scheme + ":";
    }
    if (this.authority) {
        str += "//" + this.authority;
    }
    if (this.path) {
        str += this.path;
    }
    if (this.query) {
        str += "?" + this.query;
    }
    return str;
};

/**
 * Class URIResolver
 * @constructor
 */
XML3D.URIResolver = function() {
};

/**
 * Resolve a local URI to an element
 * @param {(string|XML3D.URI)} uri Element to resolve
 * @param {Document=} document Base document to use
 * @return {Element} The resolved element or null if it could not be resolved
 */
XML3D.URIResolver.resolveLocal = function(uri, document) {
    if (typeof uri == 'string')
        uri = new XML3D.URI(uri);
    document = document || window.document;

    if (uri.scheme == 'urn')
    {
        return null;
    }

    if (!uri.path && uri.fragment) { // local uri
        return document.getElementById(uri.fragment);
    }
    return null;
};

/**
 * @deprecated
 */
XML3D.URIResolver.resolve = function(uri, document) {
    XML3D.debug.logWarning("You are using deprecated XML3D.URIResolver.resolve. Use XML3D.URIResolver.resolveLocal instead.");
    return XML3D.URIResolver.resolveLocal(uri, document);
};