(function (w) {

    function Json(url, method, data) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method || 'GET', url);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.onload = () => resolve(JSON.parse(xhr.responseText));
            xhr.onerror = () => reject(xhr.statusText);
            if (data) {
                var jdata = JSON.stringify(data);
                xhr.send(jdata);
            }
            else
                xhr.send();
        });
    }
    w.Json = Json;

    function hashObj() {
        var ret = {};
        var hash = window.location.hash.substring(1);
        hash.split(';').map(function (v) {
            var kv = v.split('=');
            ret[kv[0]] = kv[1];
        });
        return ret;
    }

    function findType(typ, obj, ret) {
        var ret = ret || [];
        if (obj.type == typ) {
            ret.push(obj);
        }
        if (obj.children)
            obj.children.map(function (v) {
                findType(typ, v, ret);
            });
        if (obj.relations)
            obj.relations.map(function (v) {
                findType(typ, v, ret);
            });
        return ret;
    }

    function each(obj, cb) {
        var ret = [];
        for (var i in obj) {
            var j = cb(i, obj[i]);
            if (j)
                ret.push(j);
        }
        return ret;
    }

    var dom = {
        applyCss: function (elm, css) {
            var st = elm.style;
            css && each(css, function (i, v) {
                st[i] = v;
            });
        },
        create: function (elm, attr) {
            var ret = document.createElement(elm);
            attr && each(attr, function (i, v) {
                //console.log(i,v);
                switch (i) {
                    case "text":
                        ret.innerText = v;
                        break;
                    case "html":
                        ret.innerHTML = v;
                        break;
                    case "className":
                        ret.className = v;
                        break;
                    case "parent":
                        v.appendChild(ret);
                        break;
                    case "css":
                        dom.applyCss(ret, v);
                        break;
                    case "click":
                        ret.addEventListener('click', v);
                        break;
                    default:
                        ret.setAttribute(i, v);

                }
                if (i == "text") {

                }

            });
            return ret;
        }
    }

    var req = w.require = {
        loaders: {},
        load: function(file) {
            return new Promise((cb, reject) => {
                var ldr = req.loaders[file];
            if (ldr) {
                if (ldr.isDone)
                    cb();
                else
                    ldr.cbs.push(cb);
            }
            else {
                req.loaders[file] = { isDone: false, cbs: [cb] };
                if (file.includes('.css')) {
                    var css = dom.create('link');
                    css.rel = 'stylesheet';
                    css.href = file;
                    document.body.appendChild(css);
                    req.done(file);
                }
                else {
                    var script = dom.create('script');
                    script.src = file;
                    script.async = true;
                    script.type = "text/javascript";
                    document.body.appendChild(script);
                }
            }
            });
        },
        done: function(file) {
            var ldr = req.loaders[file];
            ldr.isDone = true;
            each(ldr.cbs,function(i,v) {
                v&&v();
            });
        }
    };

    var cache = {};
    var fetchList = {};
    var hasLoaded = false;

    getObjectData = function (elm, id, cb) {
        cb = cb || function (d) {
            console.log('unhandled data found', d);
        }
        var depth = elm.depth;
        if (cache[id]) {
            cb(cache[id]);
            return;
        }
        if (hasLoaded) {
            Json('/api/' + id + '?depth=2').then(function (d) {
                cb(d);
            });
        }
        else {
            fetchList[id] = cb;
        }
    }

    function initalLoad() {
        hasLoaded = true;

        var ids = Object.keys(fetchList);
        Json('/api/', 'POST', ids).then(d => {
            d.map(function (v) {
                var cb = fetchList[v.id];
                cb(v);
            });
        });
    }

    function addToCache(obj) {
        var oldObj = cache[obj.id];
        if (!oldObj || !oldObj.children) {
            cache[obj.id] = obj;
        }
    }

    window.addEventListener('DOMContentLoaded', function () {
        if (!hasLoaded) {
            initalLoad();
        }
    });

    var baseNode = {
        createdCallback: function () {
            var t = this;
            this._depth = 0;
            this.loadData();
            this.createEditor();
            this.addEventListener('mouseenter', function (e) {
                t._editor.style.opacity = 1;
                t.showEdit(t._editor);
            });
            this.addEventListener('mouseleave', function () {
                setTimeout(function () {
                    t._editor.style.opacity = 0;
                }, 2000);
            });
            if (this.afterCreated)
                this.afterCreated();
        },
        createEditor: function () {
            var editor = this._editor;
            if (!editor) {
                editor = this._editor = dom.create('div', { className: 'tinyeditor', parent: document.body });
                var items = this.getToolbar();
                each(items, function (i, v) {
                    var btn = dom.create('button', { className: 'button', html: v.text, parent: editor });
                    btn.addEventListener('click', function () {
                        v.command();
                    });
                });
            }
        },
        getToolbar: function () {
            return [];
        },
        showEdit: function (e) {
            var ed = this._editor;
            var t = this;

            var rect = this.getBoundingClientRect();

            ed.style.top = rect.top + 'px';
            ed.style.left = rect.left + 'px';

        },
        reload: function () {
            delete cache[this.cmsid()];
            this._cmsid = undefined;
            this.loadData();
        },
        cmsid: function () {
            var ret = this._cmsid;
            if (!ret) {
                ret = this.getAttribute("cmsid");
                if (!ret || ret == '')
                    ret = this.getAttribute("id");
                this._cmsid = ret;
            }
            return ret;
        },
        save: function () {
            var t = this;
            var chg = this.getChanges ? this.getChanges() : this._changes;
            if (chg && Object.keys(chg).length) {
                Json("/api/" + this.cmsid(), "PUT", chg).then(function (nd) {
                    cache[t.cmsid()] = nd;
                    t.loadData(nd);
                });
            }
        },
        gotData: function (d) {
            console.log('loaded', d);
        },
        addToCache: function (d) {
            var t = this;
            cache[d.id] = d;
            if (d.relations) {
                d.relations.map(function (v) {
                    t.addToCache(v);
                });
            }
            if (d.children) {
                d.children.map(function (v) {
                    t.addToCache(v);
                });
            }
        },
        loadData: function () {
            var t = this;
            var id = this.cmsid();
            if (id) {
                getObjectData(this, id, function (d) {
                    t.data = d;
                    t.addToCache(d);
                    t.gotData(d);
                });
            }
        }
    }

    w.tinyCMS = {
        cache: cache,
        dom: dom,
        each: each,
        findType: findType,
        createElement: function (baseProt, code) {
            var ret = Object.create(baseProt);
            ret.prototype = baseProt;
            for (i in baseNode) {
                ret.prototype[i] = baseNode[i];
            }
            for (i in code) {
                ret.prototype[i] = code[i];
            }
            return ret;
        }
    }

    require.load('/base/content.js');
    require.load('/base/template.js');
    

})(window);