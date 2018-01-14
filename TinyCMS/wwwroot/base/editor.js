window.tinyCMS = {
    version:0.1
};

(function(w,tiny) {
    function getJson(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => resolve(JSON.parse(xhr.responseText));
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
      });
    }

    function each(obj,cb) {
        var ret = [];
        for(var i in obj) {
            var j = cb(i,obj[i]);
            if (j)
                ret.push(j);
        }
        return ret;
    }

    var dom = tiny.dom = {
        create: function(elm,attr) {
            var ret = document.createElement(elm);
            attr&&each(attr,function(i,v) {
                //console.log(i,v);
                switch(i) {
                    case "text":
                        ret.innerText = v;
                        break;
                    case "html":
                        ret.innerHTML = v;
                        break;
                    default:
                        ret.setAttribute(i,v);
                    
                }
                if(i=="text") {

                }
                
            });
            return ret;
        }
    }

    class TreeItem extends HTMLElement {
        constructor() {
            super();
            this._item = null;
            this.shadow = this.attachShadow({mode:'open'});
          }
        
          static get observedAttributes() { return ["item","id"]; }
        
          attributeChangedCallback(name, oldValue, newValue) {
            // name will always be "country" due to observedAttributes
            this._item = newValue;
            this._updateRendering();
          }
          connectedCallback() {
            this._updateRendering();
          }
        
          get item() {
            return this._item;
          }
          set item(v) {
            this._item = v;
          }
        
          _updateRendering() {
              console.log('render',this._item);
              this.shadow.innerHTML = '<span>'+this._item+'</span>';
            // Left as an exercise for the reader. But, you'll probably want to
            // check this.ownerDocument.defaultView to see if we've been
            // inserted into a document with a browsing context, and avoid
            // doing any work if not.
          }
        
    }

    window.customElements.define("tree-item",TreeItem, { extends:'li' });

    var treeItem = tiny.treeItem = function(opt,data) {
        this.settings = opt;
        var root = dom.create('tree-item',{html:'<span>'+data.type+'</span>',className:'apa',id:data.id});
        root.item = data;
        opt.parentElm.appendChild(root);
        
        if (data.children) {
            var ul = dom.create('ul');
            root.appendChild(ul);
            var childOpt = {parentElm:ul};
            data.children.map(function(v,i) {
                var elm = new treeItem(childOpt,v);
            });
        }
    }

    var tree = tiny.tree = function(opt) {
        this.settings = opt || {};
        this.load();
    }

    var editor = tiny.editor = function(opt) {
        this.settings = opt || {};
        console.log('editor init',this);
    }

    tree.prototype.parse = function(d) {
        var t = this;
        var item = new treeItem({parentElm:this.settings.root},d);
    }

    tree.prototype.load = function() {
        var t = this;
        console.log(this.settings);
        getJson('/api/').then(function(d) {
            console.log(d);
            t.parse(d);
        });
    }

})(window,window.tinyCMS);
