function Json(url,method,data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method||'GET', url);
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

window.tinyCMS = function (opt) {
    var elms = {};
    var ids = [];
    Array.prototype.slice.call(document.querySelectorAll("*[cmsid]")).map(function (v) {
        var id = v.getAttribute('cmsid');
        elms[id] = v;
        ids.push(id);
    });
    Json('/api/','POST', ids).then(d => {
        d.map(function (v) {
            var elm = elms[v.id];
            for (var i in v) {
                var val = v[i];
                elm.setAttribute(i, val);
            }
        });
    });
}

var xp = Object.create(HTMLParagraphElement.prototype);
xp.createdCallback = function () {
    console.log('p created',);
    this.contentEditable = true;
    var id = this.getAttribute("cmsid");
    this.addEventListener('blur', function () {
        Json('/api/'+id,'PUT', {value:this.innerText}).then(d => {
            console.log('saved');
        });
    });
}
xp.attributeChangedCallback = function (name, old, value) {
    console.log(name, value);
    if (name == "value")
        this.innerText = value;
}

var ximg = Object.create(HTMLImageElement.prototype);
ximg.attributeChangedCallback = function (name, old, value) {
    console.log(name, value);
    if (name == 'url')
        this.src = value;
    if (name == 'width' && value > 0)
        this.width = value;
    if (name == 'height' && value > 0)
        this.height = value;
}

var cmsimage = document.registerElement('cms-img', {
    prototype: ximg,
    extends: 'img'
});

var cmsp = document.registerElement('cms-p', {
    prototype: xp,
    extends: 'p'
});

//customElements.define('cms-p',TinyText,{ extends:'p' });
//customElements.define('cms-img',TinyImage,{ extends:'img' });