(function (w, tiny, r) {
    document.registerElement('cms-repeat', {
        prototype: tiny.createElement(HTMLUListElement.prototype, {
            afterCreated: function () {
                var t = this;

                this.templateHtml = this.innerHTML; //'<li><a href="{{url}}">{{name}}</li>';

            },
            gotData: function (d) {
                var t = this;
                var filter = t.getAttribute("filter");
                this.innerHTML = '';
                if (d.children) {
                    d.children.map(function (v) {
                        if (!filter || filter == v.type) {
                            var frg = document.createElement('ul');
                            frg.innerHTML = (t.templateHtml + '').replace(/{{(\w+)}}/ig, function (rep, key) {
                                var ret = v[key];
                                if (!ret && key == 'url')
                                    ret = '#/' + v['id'];
                                console.log(v);
                                return ret || key;
                            });
                            var node = frg.childNodes[0];
                            console.log(frg.childNodes, node);
                            t.appendChild(node);
                            //if (node.gotData)
                            //  node.gotData(v);
                        }
                    });
                }
            }
        }),
        extends: 'ul'
    });

    var cmsElements = [];

    function cmsElement(prot, tags) {
        var tagArray = tags.split(',');
        for (var i = 0; i < tagArray.length; i++) {
            var tag = tagArray[i];
            var np = Object.create(prot);
            np.prototype = prot;
            document.registerElement('cms-' + tag, {
                prototype: np,
                extends: tag
            });
        }
    }

    document.registerElement('cms-page', {
        prototype: tiny.createElement(HTMLLIElement.prototype, {
            gotData: function (d) {
                console.log('page data', d, this);
                this.innerHTML = d.name;
            }
        }),
        extends: 'li'
    });

    document.registerElement('cms-image', {
        prototype: tiny.createElement(HTMLImageElement.prototype, {
            gotData: function (d) {
                if (d.url) {
                    this.src = d.url;
                }
                if (d.width && d.width > 0) {
                    this.setAttribute('width', d.width);
                }
                if (d.height && d.height > 0) {
                    this.setAttribute('height', d.height);
                }
            }
        }),
        extends: 'img'
    });

    var textProt = tiny.createElement(HTMLElement.prototype, {
        afterCreated: function () {
            var t = this;
            this.contentEditable = true;
            this.addEventListener('blur', function () { t.save(); });
        },
        getChanges: function () {
            var ret = this._changes || {};
            if (!ret.value)
                ret.value = this.innerHTML;
            return ret;
        },
        gotData: function (d) {
            if (d && d.value) {
                this.innerHTML = d.value;
            }
        }
    });

    cmsElement(textProt, 'span,em,i,b,a,h1,h2,h3,h4,h5,h6,p,strong');

    r.done('/base/content.js');
})(window, tinyCMS, require);