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

var editorBase = dom.create('div');
document.body.appendChild(editorBase);
var shadow = editorBase;
//.attachShadow({mode: 'open'});
shadow.innerHTML = '<div style="position:fixed;right:0;top:0;bottom:0;background:rgba(255,255,255,0.8);left:0;transition:all 0.3s ease;display:none;padding:20%;"></div>';
var editorPrt = shadow.childNodes[0];

function showEditor(elm) {
    for(var i=0;i<editorPrt.childNodes.length;i++) {
        var v = editorPrt.childNodes[i];
        if (v.style)
            v.style.display = 'none';
    }
    editorPrt.style.display = 'block';
    editorPrt.appendChild(elm);
    elm.style.display = 'block';
}

function hideEditor() {
    editorPrt.style.display = 'none';
}

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

// window.console.log = function() {
//     var str = '';
//     for(var i=0;i<arguments.length;i++) {
//         str+=(arguments[0]+'');
//     }
//     Json("http://tinylistener.azurewebsites.net/api/Listener/sklep","POST",{data:str,clientid:'minclient'});
    
// }

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
            //shadow.appendChild(ed);
        }
        ed.innerHTML = '';
        t._changes = {};
        each(t.data,function(i,v) {
            if (i !== "id" && i !== "type" && i!=="children") {
                var prt = dom.create('div');
                prt.appendChild(dom.create('label', { html: i }));
                var inp = dom.create(v.length>40?'div':'input', { });
                if (v.length>40) {
                    inp.style.width = '100%';
                    inp.style.height = '350px';
                    inp.innerText = v;
                    var editor = ace.edit(inp);
                    editor.setTheme("ace/theme/monokai");
                    editor.session.setMode("ace/mode/html");
                }
                else {
                    inp.value = v;
                    inp.addEventListener('blur',function() {
                        console.log('change',inp,inp.value,i);
                        t._changes[i] = inp.value;
                    });
                }
                
                prt.appendChild(inp);
                ed.appendChild(prt);
            }
        });
        var saveButton = dom.create('button', { html: 'Save' });
        saveButton.addEventListener('click', function () {
            t.save();
            hideEditor();
        });
        var closeButton = dom.create('button', { html: 'Close' });
        closeButton.addEventListener('click', function () {
            hideEditor();
        });
        ed.appendChild(saveButton);
        ed.appendChild(closeButton);
        showEditor(ed);
        this.editor = ed;
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
    addToCache: function(d) {
        var t = this;
        cache[d.id] = d;
        if (d.relations) {
            d.relations.map(function(v) {
                t.addToCache(v);
            });
        }
        if (d.children) {
            d.children.map(function(v) {
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

function loadFromHash() {
    var page = window.location.hash.substring(1);
    urls = page.split('/');
    var newurl = urls[urls.length-1];
    if (page!=newurl) {
        var newtemplate;
        delete cache[newurl];
        getObjectData(this, newurl, function (d) {
            console.log('change url to ',d);
            document.title = d.name;
            newtemplate = findType('template',d);
            console.log('change template to ',newtemplate);            
            if (mainTemplate && newtemplate.length) 
            {
                mainTemplate.loadTemplate(newtemplate[0].id);
            }
        });
    }
}

loadFromHash();

window.addEventListener('hashchange',loadFromHash);

var baseid = "tpl-";

var mainTemplate;

document.registerElement('cms-template', {
    prototype: createTinyElement(HTMLDivElement.prototype, {
        afterCreated: function () {
            if (!mainTemplate)
                mainTemplate = this;
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
        loadTemplate: function(obj) {
            if (obj.html) {
                this.gotData(obj);
            }
            else {
                this._cmsid = obj;
                delete cache[obj];
                this.loadData();
            }
        },
        mapStyles: function(d) {
            var styles = this._styles;
            if (styles) {
                styles.map(function(v) {
                    v.parentElement.removeChild(v);
                });
            }
            var newStyles = [];
            d.map(function(v) {
                var css = document.createElement('style');
                css.innerHTML = v.css;
                document.head.appendChild(css);
                newStyles.push(css);
            });
            this._styles = newStyles;
        },
        mapScript: function(d) {
            var t = this;
            d.map(function(v) {
                var js = document.createElement('script');
                js.innerHTML = v.css;
                t.appendChild(js);
            });
        },
        getChanges: function() {
            return { html: this.innerHTML };
        },
        gotData: function (d) {
            var t = this;
            if (d && d.html) {
                this.innerHTML = d.html;
                var styles = findType('style',d);
                var scripts = findType('script',d);
                this.mapStyles(styles);
                this.mapScript(scripts);
                var save = dom.create('div',{html:'Save',className:'savebtn'});//.attachShaow({mode:'open'});
                this.appendChild(save);
                save.addEventListener('click',function() {
                    t.removeChild(save);
                    t.save();
                    t.appendChild(save);
                });
            }
        }
    }),
    extends: 'div'
});

function hashObj() {
    var ret = {};
    var hash = window.location.hash.substring(1);
    hash.split(';').map(function(v) {
        var kv = v.split('=');
        ret[kv[0]] = kv[1];
    });
    return ret;
}

function findType(typ,obj,ret) {
    var ret = ret||[];
    if (obj.type==typ)
    {
        ret.push(obj);
    }
    if (obj.children)
        obj.children.map(function(v) {
            findType(typ,v,ret);
        });
    if (obj.relations)
        obj.relations.map(function(v) {
            findType(typ,v,ret);
        });
    return ret;
}

document.registerElement('cms-repeat', {
    prototype: createTinyElement(HTMLUListElement.prototype, {
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



