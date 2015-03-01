describe('$', function() {
	it('should be a function', function() {
		expect($).to.exist;
		expect($).to.be.a( 'function' );
	});

	it('should return a selection when invoked with a selector', function() {
		expect( $('body') ).to.contain.keys( Object.keys($.fn) );
		expect( [].slice.call($('body')) ).to.deep.equal( [document.body] );
	});

	it('should return a selection when passed a selection', function() {
		var nodes = $('body');
		expect( $(nodes) ).to.contain.keys( Object.keys($.fn) );
		expect( [].slice.call($(nodes)) ).to.deep.equal( [document.body] );
	});

	it('should return a selection when passed a node', function() {
		expect( $(document.body) ).to.deep.equal( $([document.body]) );
	});

	it('should return an enhanced native Array', function() {
		expect( $(document.body) ).to.be.an('array');
	});

	it('should expose "fn" for extension', function() {
		expect( $.fn ).to.be.an('object');
		$.fn._test = sinon.spy();
		var sel = $('body');
		expect( sel ).to.have.property('_test');
		expect( sel._test ).to.be.a('function');
		sel._test();
		expect( $.fn._test ).to.have.been.called.once;
		delete $.fn._test;
	});
});


describe('$.extend()', function() {
	it('should be a function', function() {
		expect($.extend).to.be.a('function');
	});

	it('should copy own-properties and not prototype properties', function() {
		function Test() {
			this.prop = 'prop';
			this.prop2 = 'prop2';
		}
		Test.prototype.protoProp = 'protoProp';

		var orig = {
			foo : 'bar'
		};

		var ret = $.extend(orig, new Test());

		expect( ret ).to.equal( orig );
		expect( ret ).to.be.an.instanceof( Object );
		expect( ret ).to.have.keys('foo', 'prop', 'prop2');
		expect( ret ).not.to.have.property('protoProp');
		expect( ret ).to.have.property('foo', 'bar');
		expect( ret ).to.have.property('prop', 'prop');
		expect( ret ).to.have.property('prop2', 'prop2');
		expect( ret ).to.deep.equal( {
			foo : 'bar',
			prop : 'prop',
			prop2 : 'prop2'
		} );
	});
});


describe('$.iterate()', function() {
	it('should be a function', function() {
		expect($.iterate).to.be.a('function');
	});

	it('should call fn on each item in an Array', function() {
		var iterable = sinon.spy();
		$.iterate(['a','b','c'], iterable);
		expect( iterable.firstCall ).to.have.been.calledWith('a', 0);
		expect( iterable.secondCall ).to.have.been.calledWith('b', 1);
		expect( iterable.thirdCall ).to.have.been.calledWith('c', 2);
	});

	it('should break out of the loop when a value is returned', function() {
		var iterable = sinon.spy(function() {
			return 'test';
		});
		var ret = $.iterate(['a','b','c'], iterable);
		expect( iterable ).to.have.been.calledOnce;
		expect( iterable ).to.have.been.calledWithExactly('a', 0);
		expect( ret ).to.equal('test');
	});
});


describe('$(..).each()', function() {
	var nodes = [
			document.createElement('div'),
			document.createElement('div')
		],
		sel = $(nodes);

	it('should be a function', function() {
		expect( sel.each ).to.be.a('function');
	});

	it('should be called on each node in the selection', function() {
		//var spy = sinon.spy(sel, 'each');
		var spy = sinon.spy(),
			ret = sel.each(spy);

		expect( spy ).to.have.been.calledTwice;
		expect( spy.firstCall.args[0][0] ).to.equal(nodes[0]);
		expect( spy.secondCall.args[0][0] ).to.equal(nodes[1]);
		expect( ret ).to.equal( sel );
	});
});


describe('$(..).children()', function() {
	var nodes = [
			document.createElement('div'),
			document.createElement('div')
		],
		sel = $(nodes);

	nodes[0].innerHTML = '\n\t<div> <span>te st</span> </div>\n\n <p>test 2</p>';
	nodes[1].innerHTML = '<div><span>test</span></div><p>test 2</p>';

	it('should be a function', function() {
		expect( sel.children ).to.be.a('function');
	});

	it('should return the correct children', function() {
		expect( sel.children() ).to.have.length(4);

		expect( sel.children()[0] ).to.have.property('nodeName', 'DIV');
		expect( sel.children()[0] ).to.have.property('innerHTML', ' <span>te st</span> ');

		expect( sel.children()[1] ).to.have.property('nodeName', 'P');

		expect( sel.children()[2] ).to.have.property('nodeName', 'DIV');
		expect( sel.children()[2] ).to.have.property('innerHTML', '<span>test</span>');

		expect( sel.children()[3] ).to.have.property('nodeName', 'P');

	});

	it('should only return element nodes (not #comment, #text, etc)', function() {
		var node = document.createElement('div');
		node.innerHTML = '-  oin2g4 <!-- test comment --> \n \t <!DOCTYPE html> jt';
		expect( $(node).children() ).to.be.empty;
	});
});


describe('$(..).on()', function() {
	var node = document.createElement('div');

	it('should call addEventListener when invoked', function() {
		var spy = sinon.stub();
		node.addEventListener = spy;
		function handler(){}
		$(node).on('click', handler);
		expect( spy ).to.have.been.calledOnce;
		expect( spy ).to.have.been.calledWithExactly('click', handler);
	});
});


describe('$(..).off()', function() {
	var node = document.createElement('div');

	it('should call removeEventListener when invoked', function() {
		var spy = sinon.stub();
		node.removeEventListener = spy;
		function handler(){}
		$(node).off('click', handler);
		expect( spy ).to.have.been.calledOnce;
		expect( spy ).to.have.been.calledWithExactly('click', handler);
	});
});


describe('$(..).classify()', function() {
	var node = document.createElement('div');
	node.className = 'already-added';

	it('should add a class if it does not exist', function() {
		$(node).classify('test');
		expect( node.className ).to.equal( 'already-added test' );
	});

	it('should not modify className if a class already exists', function() {
		var className = node.className;
		$(node).classify('already-added');
		expect( node.className ).to.equal( className );
	});
});


describe('$(..).declassify()', function() {
	var node = document.createElement('div');
	node.className = 'exists';

	it('should remove a class if it exists', function() {
		$(node).declassify('exists');
		expect( node.className ).to.be.empty;
	});

	it('should not modify className if a class doesn\'t exist', function() {
		var className = node.className;
		$(node).declassify('does-not-exist');
		expect( node.className ).to.equal( className );
	});
});


describe('$(..).hasClass()', function() {
	var node = document.createElement('div');
	node.className = 'exists also-exists';

	it('should return true if a class exists', function() {
		expect( $(node).hasClass('exists') ).to.equal( true );
		expect( $(node).hasClass('also-exists') ).to.equal( true );
	});

	it('should return false if a class doesn\'t exist', function() {
		expect( $(node).hasClass('does-not-exist') ).to.equal( false );
		// try a removed class
		$(node).declassify('also-exists');
		expect( $(node).hasClass('also-exists') ).to.equal( false );
	});
});


describe('$(..).toggleClass()', function() {
	var node = document.createElement('div');

	it('should add a class if it doesn\'t exist', function() {
		node.className = '';
		$(node).toggleClass('new-class');
		expect( node.className ).to.equal( 'new-class' );
		node.className = '';
	});

	it('should remove a class if it exists', function() {
		node.className = 'existing-class';
		$(node).toggleClass('existing-class');
		expect( node.className ).to.equal( '' );
	});

	it('should not leave residue', function() {
		node.className = '';
		$(node).toggleClass('foo').toggleClass('foo');
		expect( node.className ).to.equal( '' );
	});
});


describe('$(..).css()', function() {
	var node = document.createElement('div');

	it('should apply styling when an object is passed', function() {
		node.style.cssText = '';
		$(node).css({
			top : '5px',
			left : '-5px'
		});
		expect( node.style.cssText.trim() ).to.equal( 'top: 5px; left: -5px;' );
	});

	it('should return a detached node\'s current style when passed nothing', function() {
		node.style.cssText = 'border:1px solid #000; padding:5px;';
		expect( $(node).css().border ).to.match(/^1px\s+solid\s+(#000(000)?|rgba?\(0\,\s*0\,\s*0\))$/g);	// yuck
		expect( $(node).css() ).to.have.property('padding', '5px');
	});

	it('should return a detached node\'s current style property when passed a string', function() {
		node.style.cssText = 'border:1px solid #000; padding:2px 1px;';
		expect( $(node).css('padding') ).to.equal( '2px 1px' );
	});

	it('should return computed style when passed nothing', function() {
		document.body.appendChild(node);
		node.style.cssText = 'border:none;';
		expect( $(node).css() ).to.deep.equal( getComputedStyle(node) );
		expect( $(node).css().border ).to.match(/(\b0(px)?\b|\bnone\b|^$)/g);
	});

	it('should return computed style property when passed a string', function() {
		document.body.appendChild(node);
		node.style.cssText = 'border:1px solid #000; padding:1px;';
		expect( $(node).css('border') ).to.match(/^1px\s+solid\s+(#000(000)?|rgba?\(0\,\s*0\,\s*0\))$/g);
		expect( $(node).css('padding') ).to.equal( '1px' );
	});
});


describe('$(..).text()', function() {
	var node = document.createElement('div');

	it('should return textual content when passed nothing', function() {
		node.textContent = 'test';
		expect( $(node).text() ).to.equal('test');
	});

	it('should return textual content of node and all descendants', function() {
		node.innerHTML = 'foo <p>test inner <span>content</span></p> bar';
		expect( $(node).text() ).to.equal( 'foo test inner content bar' );
	});

	it('should set node text when passed a string', function() {
		node.innerHTML = '<p>foo</p> bar';
		$(node).text('test text');
		expect( node.textContent ).to.equal('test text');
		expect( node.innerHTML ).to.equal('test text');
	});

	it('should not parse HTML', function() {
		var str = 'foo <p>test inner content</p> bar';
		$(node).text(str);
		expect( node.textContent ).to.equal(str);
		expect( node.childNodes ).to.be.have.length(1);
		expect( node.childNodes[0] ).to.have.property('nodeType', 3);
	});

	it('should clear node contents when passed an empty string', function() {
		node.innerHTML = 'blah';
		$(node).text('');
		expect( node.textContent ).to.be.empty;
		expect( node.innerHTML ).to.be.empty;
	});
});


describe('$(..).html()', function() {
	var node = document.createElement('div');

	it('should return HTML content when passed nothing', function() {
		node.textContent = 'test';
		expect( $(node).html() ).to.equal('test');

		node.innerHTML = '<div>test <b>data</b></div>';
		expect( $(node).html() ).to.equal( '<div>test <b>data</b></div>' );
	});

	it('should set HTML content when passed a string', function() {
		var str = 'foo <p>test <b>inner</b> content</p><!-- bar -->';
		$(node).html(str);
		expect( node.textContent ).to.equal('foo test inner content');
		expect( node.innerHTML ).to.equal('foo <p>test <b>inner</b> content</p><!-- bar -->');
		expect( node.childNodes ).to.have.length(3);
		expect( node.childNodes[0] ).to.have.property('nodeType', 3);		// #text node
		expect( node.childNodes[1] ).to.have.property('nodeType', 1);		// element node
		expect( node.childNodes[1] ).to.have.property('nodeName', 'P');
		expect( node.childNodes[2] ).to.have.property('nodeType', 8);		// #comment node
	});

	it('should clear node contents when passed an empty string', function() {
		node.innerHTML = 'foo <p>test <b>inner</b> content</p><!-- bar -->';
		$(node).html('');
		expect( node.textContent ).to.be.empty;
		expect( node.innerHTML ).to.be.empty;
	});
});


describe('$(..).attr()', function() {
	var node = document.createElement('div');

	it('should return attribute value when passed an existent name', function() {
		node.setAttribute('test', 'value');
		expect( $(node).attr('test') ).to.equal('value');
	});

	it('should return attribute value when passed a non-existent name', function() {
		expect( $(node).attr('does-not-exist') ).to.equal(null);
	});

	it('should set attribute value when passed a name and value', function() {
		$(node).attr('new-attribute', 'new-value');
		expect( node.getAttribute('new-attribute') ).to.equal( 'new-value' );

		$(node).attr('new-attribute', 'updated-value');
		expect( node.getAttribute('new-attribute') ).to.equal( 'updated-value' );
	});

	it('should empty attribute value when passed a name and empty string', function() {
		$(node).attr('thing', '');
		expect( node.getAttribute('thing') ).to.be.empty;
	});
});


describe('$(..).prop()', function() {
	var node = document.createElement('div');

	it('should return attribute value when passed an existent name', function() {
		node.test = 'value';
		expect( $(node).prop('test') ).to.equal('value');
	});

	it('should return attribute value when passed a non-existent name', function() {
		expect( $(node).prop('doesNotExist') ).to.equal( null );
	});

	it('should set attribute value when passed a name and value', function() {
		$(node).prop('newProp', 5);
		expect( node.newProp ).to.equal( 5 );

		$(node).prop('newProp', 'changedValue');
		expect( node.newProp ).to.equal( 'changedValue' );
	});

	it('should empty attribute value when passed a name and empty string', function() {
		$(node).prop('thing', '');
		expect( node.thing ).to.be.empty;
	});
});


describe('$(..).remove()', function() {
	var nodes = [
			document.createElement('div'),
			document.createElement('div')
		];

	it('should do nothing if the node has no parent', function() {
		$(nodes).remove();
		expect( nodes[0].parentNode ).to.equal(null);
		expect( nodes[0].offsetParent ).to.equal(null);
	});

	it('should remove a node if it has a parent', function() {
		document.body.appendChild(nodes[0]);
		document.body.appendChild(nodes[1]);

		expect( nodes[0].parentNode ).to.equal(document.body);
		expect( nodes[0].offsetParent ).to.equal(document.body);
		expect( nodes[1].parentNode ).to.equal(document.body);
		expect( nodes[1].offsetParent ).to.equal(document.body);

		$(nodes).remove();

		expect( nodes[0].parentNode ).to.equal(null);
		expect( nodes[0].offsetParent ).to.equal(null);
		expect( nodes[1].parentNode ).to.equal(null);
		expect( nodes[1].offsetParent ).to.equal(null);
	});
});
