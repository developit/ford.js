function $(p) {
	return $.extend(
		typeof p==='string' ? document.querySelectorAll(p) : $.arr(p),
		$.fn
	);
}

$.fn = {};

$.arr = function(obj) {
	return Array.prototype[typeof obj.length==='number'?'slice':'concat'].call(obj);
};

$.extend = function(o, p, i) {
	for (i in p)
		if (p.hasOwnProperty(i))
			o[i] = p[i];
	return o;
};

$.iterate = function(c, f) {
	for (var i=0, a, len=c.length; i<len; i++) {
		a = f.call(c, c[i], i);
		if (a!==undefined)
			return a;
	}
	return c;
};

function wrap(method, ns, ret) {
	return function() {
		var a = arguments, i;
		return $.iterate(this, function(c, o, j, p) {
			o = ns && c[ns] || c;
			j = o[method];
			p = (j || method).apply(o, a);
			return ret===false ? i : p;
		});
	};
}
$.fn._wrap = wrap;

$.extend($.fn, {
	each : wrap(function(f){ return f(this); }),
	children : function() {
		for (var i=0,a=[]; i<this.length; i++) {
			a.push.apply(a, $.arr(this[i].children));
		}
		return $(a);
	},
	
	on : wrap('addEventListener', 0, false),
	off : wrap('removeEventListener', 0, false),
	
	classify : wrap('add', 'classList', false),
	declassify : wrap('remove', 'classList', false),
	hasClass : wrap('contains', 'classList'),
	toggleClass : wrap('toggle', 'classList', false),
	css : wrap(function(s, c, p) {
		if (!s || s.charAt) return p=this.style, (c = this.offsetParent ? getComputedStyle(this,null) : p) && s ? (c[s] || p[s]) : c;
		$.extend(this.style, s);
	}),
	
	text : wrap(function(t) {
		if (t==null) return this.textContent;
		this.textContent = t;
	}),
	html : wrap(function(h) {
		if (h==null) return this.innerHTML;
		this.innerHTML = h;
	}),
	
	attr : wrap(function(k, v) {
		return this[(v==null?'g':'s') + 'etAttribute'](k, v);
	}),
	prop : wrap(function(k, v) {
		if (v==null) return v=this[k], v==null?null:v;
		this[k] = v;
	}),
	
	remove : wrap(function() {
		this.parentNode && this.parentNode.removeChild(this);
	})
});

if (typeof window.define==='function' && window.define.amd) {
	window.define([], function(){ return $; });
}
