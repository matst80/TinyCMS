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
                default:
                    ret.setAttribute(i, v);

            }
            if (i == "text") {

            }

        });
        return ret;
    }
}

var cache = {};
var fetchList = {};
var hasLoaded = false;

getObjectData = function (elm, id, cb) {
    cb = cb || function (d) {
        console.log('unhandled data found', d);
    }
    var depth = elm.depth
    //var id = elm.getAttribute("cmsid");
    if (cache[id])
        cb(cache[id]);
    if (hasLoaded) {
        Json('/api/' + id + '?depth=1').then(function (d) {
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
        this.addEventListener('contextmenu', function (e) {
            console.log('click');
            t.startEdit(e);
            e.stopPropagation();
            return false;
        });
        if (this.afterCreated)
            this.afterCreated();
    },
    startEdit: function (e) {
        var ed = this.editor;
        var t = this;
        if (!ed) {
            ed = this.editor = dom.create('div', {
                className: 'editor'
            });
            document.body.appendChild(ed);
        }
        t._changes = {};
        each(t.data,function(i,v) {
            if (i !== "id" && i !== "type" && i!=="children") {
                var prt = dom.create('div');
                prt.appendChild(dom.create('label', { html: i }));
                var inp = dom.create('textarea', { });
                inp.value = v;
                inp.addEventListener('blur',function() {
                    console.log('change',inp,inp.value,i);
                    t._changes[i] = inp.value;
                });
                prt.appendChild(inp);
                ed.appendChild(prt);
            }
        });
        var saveButton = dom.create('button', { value: 'Save' });
        saveButton.addEventListener('click', function () {
            t.save();
        });
        ed.appendChild(saveButton);
        this.editor = ed;
    },
    reload: function () {
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
        var chg = this.getChanges?this.getChanges():this._changes;
        if (chg && Object.keys(chg).length) {
            Json("/api/" + this.cmsid(), "PUT", chg).then(function(nd) {
                cache[t.cmsid()] = nd;
                t.loadData(nd);
            });
        }
    },
    gotData: function (d) {
        console.log('loaded', d);
    },
    loadData: function () {
        var t = this;
        var id = this.cmsid();
        if (id) {
            getObjectData(this, this.cmsid(), function (d) {
                //console.log('got data',d);
                t.data = d;
                t.gotData(d);
            });
        }
    }
}

createTinyElement = function (baseProt, code) {
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

window.tinyCMS = function (opt) {
    var elms = {};
    var ids = [];
}

window.addEventListener('hashchange',function() {
    console.log(window.location.hash);    
});

var baseid = "tpl-";

document.registerElement('cms-template', {
    prototype: createTinyElement(HTMLBodyElement.prototype, {
        afterCreated: function () {
            var t = this;
            this.addEventListener('dblclick', function (e) {
                var obj = e.target;
                var cmsid = obj.getAttribute('cmsid');
                var tagName = obj.tagName;
                
                if (cmsid==null) {
                    var url = '/api/'+t.cmsid()+'?type=';
                    var newdata = {};
                    var type;
                    var tagtype;
                    if (tagName=="DIV") {
                        type = 'template';
                        newdata.html = obj.innerHTML;
                    }
                    else if (tagName=="IMG") {
                        type = 'image';  
                        newdata.src = obj.src;
                        newdata.width = obj.width;
                        newdata.height = obj.height;  
                    }
                    else {
                        type = 'text';
                        tagtype = tagName.toLowerCase();   
                        newdata.value = obj.innerHTML;                     
                    }
                    if (type) {
                        Json(url+type,"POST",newdata).then(d=>{
                            obj.setAttribute("cmsid",d.id);
                            obj.setAttribute("is","cms-"+(tagtype||type));
                            obj.gotData(d);
                            t._changes = {html:t.innerHTML};
                            t.save();
                        });
                    }
                }
            });
        },
        gotData: function (d) {
            console.log('template data', d);
            if (d && d.html) {
                this.innerHTML = d.html;
            }
        }
    }),
    extends: 'body'
});

document.registerElement('cms-repeat', {
    prototype: createTinyElement(HTMLUListElement.prototype, {
        afterCreated: function () {
            var t = this;
            //this.shadow = this.attachShadow({mode:'open'});
            this.templateHtml = '<li><a href="{{url}}">{{name}}</li>';//this.innerHTML;

        },
        gotData: function (d) {
            var t = this;
            var filter = t.getAttribute("filter");
            this.innerHTML = '';
            if (d.children) {
                d.children.map(function (v) {
                    if (!filter || filter == v.type) {
                        var frg = document.createElement('ul');
                        frg.innerHTML = (t.templateHtml+'').replace(/{{(\w+)}}/ig,function(rep,key) {
                            var ret = v[key];
                            if (!ret && key=='url')
                                ret = '#/'+v['id'];
                            console.log(v);
                            return ret||key;
                        });
                        var node = frg.childNodes[0];
                        console.log(frg.childNodes,node);
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

function cmsElement(prot,tags) {
    var tagArray = tags.split(',');
    for(var i=0;i<tagArray.length;i++) {
        var tag = tagArray[i];
        var np = Object.create(prot);
        np.prototype = prot;
        document.registerElement('cms-'+tag,{
            prototype: np,
            extends:tag
        });
    }
}

document.registerElement('cms-page', {
    prototype: createTinyElement(HTMLLIElement.prototype, {
        gotData: function (d) {
            console.log('page data', d, this);
            this.innerHTML = d.name;
        }
    }),
    extends: 'li'
});

document.registerElement('cms-image', {
    prototype: createTinyElement(HTMLImageElement.prototype, {
        gotData: function (d) {
            if (d.url) {
                this.src = d.url;
            }
            if (d.width && d.width>0) {
                this.setAttribute('width',d.width);
            }
            if (d.height && d.height>0) {
                this.setAttribute('height',d.height);
            }
        }
    }),
    extends: 'img'
});

var textProt = createTinyElement(HTMLElement.prototype, {
    afterCreated: function () {
        var t = this;
        this.contentEditable = true;
        this.addEventListener('blur', function () { t.save(); });
    },
    getChanges: function () {
        var ret = this._changes||{};
        if(!ret.value)
            ret.value = this.innerHTML;
        return ret;
    },
    gotData: function (d) {
        if (d && d.value) {
            this.innerHTML = d.value;
        }
    }
});

cmsElement(textProt,'span,em,i,b,a,h1,h2,h3,h4,h5,h6,p,strong');



