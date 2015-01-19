if (!Element.prototype.children) {
	Object.defineProperty(Element.prototype, 'children', {
		get : function() {
			return [].slice.call(this.childNodes).filter(function(n){ return n.nodeType===1; });
		}
	});
}

if (!Element.prototype.remove) {
	Element.prototype.remove = function() {
		if (this.parentNode) this.parentNode.removeChild(this);
	};
}
