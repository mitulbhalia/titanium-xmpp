/**
 * XmlDocument factory
 * @private
 */
function XmlDocument() {
}

XmlDocument.create = function(name, ns) {
	name = name || 'foo';
	ns = ns || '';

	try {
		// DOM2
		var baseDoc = Ti.XML.parseString("<a/>");
		var doc = baseDoc.implementation.createDocument(ns, name, null);
		if(doc.readyState == null) {
			doc.readyState = 1;
			doc.addEventListener("load", function() {
				doc.readyState = 4;
				if( typeof doc.onreadystatechange == "function")
					doc.onreadystatechange();
			}, false);
		}
		if(!doc.documentElement || doc.documentElement.tagName != name || (doc.documentElement.namespaceURI && doc.documentElement.namespaceURI != ns)) {
			try {
				if(ns != '')
					doc.appendChild(doc.createElement(name)).setAttribute('xmlns', ns);
				else
					doc.appendChild(doc.createElement(name));
			} catch (dex) {
				doc = document.implementation.createDocument(ns, name, null);

				if(doc.documentElement == null)
					doc.appendChild(doc.createElement(name));

				if(ns != '' && doc.documentElement.getAttribute('xmlns') != ns) {
					doc.documentElement.setAttribute('xmlns', ns);
				}
			}
		}

		return doc;
	} catch (ex) {
		Ti.API.debug("Your browser does not support XmlDocument objects"+ex);
	}
	//throw new
};

/**
 * used to find the Automation server name
 * @private
 */
XmlDocument.getPrefix = function() {
	if(XmlDocument.prefix)
		return XmlDocument.prefix;

	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for(var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			o = new ActiveXObject(prefixes[i] + ".DomDocument");
			return XmlDocument.prefix = prefixes[i];
		} catch (ex) {
		};
	}

	throw new Error("Could not find an installed XML parser");
};

// Create the loadXML method
if( typeof (Titanium.XML.Document) != 'undefined') {

	/**
	 * XMLDocument did not extend the Document interface in some
	 * versions of Mozilla.
	 * @private
	 */
	Titanium.XML.Document.prototype.loadXML = function(s) {

		// parse the string to a new doc
		var doc2 = Ti.XML.parseString(s, "text/xml");

		// remove all initial children
		while(this.hasChildNodes())
		this.removeChild(this.lastChild);

		// insert and import nodes
		for(var i = 0; i < doc2.childNodes.length; i++) {
			this.appendChild(this.importNode(doc2.childNodes[i], true));
		}
	};
}

/*
 if (window.XMLSerializer &&
 window.Node && Node.prototype && Node.prototype.__defineGetter__) {

 XMLDocument.prototype.__defineGetter__("xml", function () {
 return (new XMLSerializer()).serializeToString(this);
 });
 Document.prototype.__defineGetter__("xml", function () {
 return (new XMLSerializer()).serializeToString(this);
 });

 Node.prototype.__defineGetter__("xml", function () {
 return (new XMLSerializer()).serializeToString(this);
 });
 }
 */