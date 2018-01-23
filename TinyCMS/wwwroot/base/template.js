(function (w, tiny, r) {

  function loadFromHash() {
    var page = window.location.hash.substring(1);
    urls = page.split('/');
    var newurl = urls[urls.length - 1];
    if (page != newurl) {
      var newtemplate;
      delete tiny.cache[newurl];
      getObjectData(this, newurl, function (d) {
        document.title = d.name;
        newtemplate = tiny.findType('template', d);
        if (mainTemplate && newtemplate.length) {
          mainTemplate.loadTemplate(newtemplate[0].id);
        }
      });
    }
  }

  loadFromHash();

  window.addEventListener('hashchange', loadFromHash);

  var baseid = "tpl-";

  var mainTemplate;

  // function openStyleEditor(elm) {

  // }

  document.registerElement('cms-template', {
    prototype: tiny.createElement(HTMLDivElement.prototype, {
      afterCreated: function () {
        if (!mainTemplate)
          mainTemplate = this;
        var t = this;
        var lastElement;
        // this.addEventListener('mousemove',function(e) {
        //   if (e.target) {
        //     if (e.target!=lastElement) {
        //       lastElement = e.target;
        //       console.log('current element:',lastElement);
        //     }
        //   }
        // });
        // this.addEventListener('click',function(e) {
        //   t.selectedElement = lastElement;
        //   openStyleEditor(lastElement);
        // });
        this.addEventListener('dblclick', function (e) {
          var obj = e.target;
          var cmsid = obj.getAttribute('cmsid');
          var tagName = obj.tagName;

          if (cmsid == null) {
            var url = '/api/' + t.cmsid() + '?type=';
            var newdata = {};
            var type;
            var tagtype;
            if (tagName == "DIV") {
              type = 'template';
              newdata.html = obj.innerHTML;
            }
            else if (tagName == "IMG") {
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
              Json(url + type, "POST", newdata).then(d => {
                obj.setAttribute("cmsid", d.id);
                obj.setAttribute("is", "cms-" + (tagtype || type));
                obj.gotData(d);
                t._changes = { html: t.innerHTML };
                t.save();
              });
            }
          }
        });
      },
      loadTemplate: function (obj) {
        if (obj.html) {
          this.gotData(obj);
        }
        else {
          this._cmsid = obj;
          delete tiny.cache[obj];
          this.loadData();
        }
      },
      mapStyles: function (d) {
        var styles = this._styles;
        if (styles) {
          styles.map(function (v) {
            v.parentElement.removeChild(v);
          });
        }
        var newStyles = [];
        d.map(function (v) {
          var css = document.createElement('style');
          css.setAttribute("cmsid", v.id);
          css.innerHTML = v.css;
          document.head.appendChild(css);
          newStyles.push(css);
        });
        this._styles = newStyles;
      },
      mapScript: function (d) {
        var t = this;
        var scripts = [];
        d.map(function (v) {
          var js = document.createElement('script');
          js.setAttribute("cmsid", v.id);
          js.innerHTML = v.css;
          t.appendChild(js);
          scripts.push(js);
        });
        this._scripts = scripts;
      },
      getChanges: function () {
        var t = this;
        this._scripts.map(function (v) {
          var id = v.getAttribute('cmsid');
          if (id) {
            Json("/api/" + id, "PUT", {
              js: v.innerHTML
            }).then(function (nd) {
              tiny.cache[id] = nd;
            });
          }
        });
        this._styles.map(function (v) {
          var id = v.getAttribute('cmsid');
          if (id) {
            Json("/api/" + id, "PUT", {
              css: v.innerHTML
            }).then(function (nd) {
              tiny.cache[id] = nd;
            });
          }
        });
        return { html: this.innerHTML };
      },
      getToolbar: function () {
        var t = this;
        return [{
          text: 'Edit',
          command: function (elm) {
            var html = t.innerHTML;
            var htmlShadow = tiny.dom.create('div', { parent: document.body, css: { bottom: '0', position: 'fixed', 'z-index': '99999', height: '30%', left: '0', right: '0' } });

            var editor = ace.edit(htmlShadow);
            editor.setTheme("ace/theme/monokai");
            editor.session.setMode("ace/mode/javascript");

            editor.getSession().on('change', function (e) {

              t.innerHTML = editor.getValue();
            });

            editor.setValue(html);
          }
        }, {
          text: 'Duplicate',
          command: function () {
            console.log(t.data);
            var prt = t.data.parentId;
            Json('/api/' + prt + '?type=template', 'POST',
              {
                html: t.data.html
              }).then((d) => {
                var newid = d.id;
                tiny.each(t._styles, function (i, v) {
                  var id = v.getAttribute("cmsid");
                  Json('/api/' + newid + '/' + id, 'PUT');
                });
                tiny.each(t._scripts, function (i, v) {
                  var id = v.getAttribute("cmsid");
                  Json('/api/' + newid + '/' + v.id, 'PUT');
                });
                Json('/api/' + prt + '?type=page', 'POST',
                  {
                    name: document.title+' copy'
                  }).then((page) => {
                    Json('/api/' + newid + '/' + page.id, 'PUT').then((pageobj) => {
                      window.location.hash = '/' + page.id;
                    });
                  });

              });
          }
        }, {
          text: 'Save',
          command: function () {
            t.save();
          }
        }, {
          text: 'Grapes',
          command: function () {
            var style = '';
            tiny.each(t._styles, function (i, v) {
              style += v.innerHTML;
            });

            require.load('/js/grapes.min.js').then(function () {
              require.load('/css/grapes.min.css');
              var editor = grapesjs.init({
                container: t,
                protectedCss: '',
                fromElement: true,
                //components: '<div class="txt-red">Hello world!</div>',
                //style: style,
              });
              editor.setStyle(style);
              var iframe = editor.Canvas.getFrameEl();
              var ss = document.querySelectorAll('link[rel="stylesheet"]');
              for (var i = 0; i < ss.length; i++) {
                var lnk = tiny.dom.create('style', { rel: 'stylesheet', href: ss[i].href });
                iframe.contentDocument.head.appendChild(lnk);
              }
            });
          }
        }]
      },
      gotData: function (d) {
        var t = this;
        if (d && d.html) {
          this.innerHTML = d.html;
          var styles = tiny.findType('style', d);
          var scripts = tiny.findType('script', d);
          this.mapStyles(styles);
          this.mapScript(scripts);
        }
      }
    }),
    extends: 'div'
  });
  r.done('/base/template.js');
})(window, window.tinyCMS, require);