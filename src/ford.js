(function(g, f) {
	if (typeof define==='function' && define.amd)
		define([], f);
	else if (typeof module==='object' && module.exports)
		module.exports = f();
	else
		g.$ = f();
}(this, function() {
	var s = document.createElement('div');

	function $(p,w) {
		return $.extend(
			$.arr( typeof p==='string' ? (
				p[0]==='<' ? (s.innerHTML=p, s.childNodes) : (w || document).querySelectorAll(p)
			) : p),
			$.fn
		);
	}

	$.fn = {};

	$.arr = function(obj) {
		return Array.isArray(obj) ? obj : Array.prototype[typeof obj.length==='number'?'slice':'concat'].call(obj);
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

	function map(method, ns) {
		return function() {
			for (var i=0,a=[],c,p,g=$.arr(arguments); i<this.length; i++) {
				c = ns || this[i];
				p = c[method] || method || g.shift();
				a.push.apply(a, $.arr( p.apply ? p.apply(c, g) : p ));
			}
			return $(a);
		};
	}


	$.extend($.fn, {
		map : map,
		_wrap : wrap,
		each : wrap(function(f){ return f($(this)); }),

		clone : map('cloneNode'),
		children : map('children'),
		append : wrap('appendChild', 0, false),
		appendTo : function(p){ $(p).append(this[0]); return this; },
		remove : wrap('remove', 0, false),
		parent : map(function(s,p){ p=this; while((p=p.parentNode) && (s && !p.matches(s))); return p; }),
		query : map('querySelectorAll'),

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
		show : function(){ return this.css({ display:'' }); },
		hide : function(){ return this.css({ display:'none' }); },

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

		tpl : function(fields) {
			this.query('[tpl]').each(function(n) {
				var tpl = n.attr('tpl').replace(/\s+/,''),
					r = /(.+?)\:(.+?)(;|$)/g,
					t, k, i, v;
				r.lastIndex = 0;
				while ((t=r.exec(tpl))) {
					n[ t[1] ]( fields[t[2]] );
				}
			});
			return this;
		}
	});

	return $;
}));
