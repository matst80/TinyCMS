
var selectedNode;

var knownTypes =
    {
        'text': {
            id:'',
            type: 'text',
            text: ''
        },
        'template': {
            id:'',
            type: 'template',
            html: '<div>template text</div>'
        },
        'page': {
            id:'',
            type: 'page',
            url: ''
        },
        'image': {
            id:'',
            type: 'image',
            url: '/img/blank.gif'
        },
        'script': {
            id:'',
            type: 'script',
            js: 'function() { }'
        },
        'style': {
            id:'',
            type: 'style',
            css: ''
        }
    }

function deleteNode() {
    if (confirm('Do you want to delete this node?')) {
        Json('/api/' + selectedNode.id, 'DELETE').then((d) => {
            loadData();
        });
    };
}

var prpCnt = document.getElementById('properties');

var deleteBtn = document.getElementById('deletenode');
deleteBtn.addEventListener('click', deleteNode);

var newBtn = document.getElementById('newnode');
newBtn.addEventListener('click', function () {
    var prtId = selectedNode.parentId || 'root';
    selectedNode = { id:'', type: selectedNode.type || 'text' };
    selectedNode.parentId = prtId;
    populateProperties();
});

var duplicateBtn = document.getElementById('duplicatenode');
duplicateBtn.addEventListener('click', function () {
    var baseId = selectedNode.id;
    // do duplicate
    populateProperties();
});


function parseNode(d, prt) {
    var li = createNode(d, prt);
    li.id = d.id;
    li.data = d;
    li.addEventListener('click', function (e) {
        window.location.hash = '/' + d.id;
        e.stopPropagation();

    });
    if (d.children) {
        var ul = document.createElement('ul');
        li.appendChild(ul);
        d.children.map(function (v) {
            parseNode(v, ul);
        });
    }
}

function Json(url, method, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method || 'GET', 'http://localhost:5000'+url);
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

function createNode(d, prt) {
    var li = document.createElement('li');
    var span = document.createElement('span');
    var add = '';
    if (d.name) {
        add = ' (' + d.name + ')';
    }
    if (d.value) {
        add = ' (' + d.value.substring(0, Math.min(d.value.length, 18)) + '...)';
    }
    span.innerHTML = d.type + ': ' + d.id + add;
    li.appendChild(span);
    prt.appendChild(li);
    return li;
}

var excluded = ['children'];

var aceedit = ['html', 'css', 'js'];

function addIcon(prt,icn,cb) {
    var span = document.createElement('span');
    var i = document.createElement('i');
    i.className = 'fa '+icn;
    prt.appendChild(span);
    span.appendChild(i);
    span.addEventListener('click',cb);
}

function populateProperties() {
    var d = selectedNode;
    prpCnt.innerHTML = '';
    for (i in d) {
        var val = d[i];
        if (excluded.indexOf(i) == -1) {
            var cnt = document.createElement('div');
            prpCnt.appendChild(cnt);

            var lbl = document.createElement('label');
            lbl.innerText = i;
            cnt.appendChild(lbl);
            if (i == 'relations') {
                var ul = document.createElement('ul');
                val.map(function (d) {
                    var li = createNode(d, ul);
                    addIcon(li,'fa-times',function() {

                    });
                    
                });
                cnt.appendChild(ul);
            }
            else if (i == 'type') {
                var sel = document.createElement('select');
                for (var j in knownTypes) {
                    var tp = knownTypes[j];
                    var opt = document.createElement('option');
                    opt.value = j;
                    opt.innerText = j;
                    sel.appendChild(opt);
                }
                sel.value = val;
                cnt.appendChild(sel);
                sel.addEventListener('change', function () {
                    if (confirm('change type?')) {
                        console.log(sel,sel.value);
                        var nd = knownTypes[sel.value];
                        console.log('type template',nd);
                        var prtId = selectedNode.parentId || 'root';
                        selectedNode = JSON.parse(JSON.stringify(nd));
                        selectedNode.parentId = prtId;
                        populateProperties();
                    }
                });
                
            }
            else if (aceedit.indexOf(i) == -1) {
                var inp = document.createElement('input');
                inp.value = val;
                cnt.appendChild(inp);
                inp.addEventListener('change', function () {
                    d[i] = inp.value;
                });
            }
            else {
                var te = document.createElement('div');
                cnt.appendChild(te);
                te.style.width = '100%';
                te.style.height = '500px';
                var editor = ace.edit(te);
                editor.setTheme("ace/theme/monokai");
                var tp = i;
                if (i == 'js')
                    tp = 'javascript';
                editor.session.setMode("ace/mode/" + tp);
                editor.session.setValue(val);
                editor.session.on('change', function () {
                    d[i] = editor.session.getValue();
                });

            }
        }
    }
    var btn = document.createElement('button');
    btn.innerText = 'Save';
    btn.addEventListener('click', function () {
        Json('/api/' + d.id, 'PUT', d).then(function (d) {
            loadData();
        });
    });
    prpCnt.appendChild(btn);
}

function setSelectionFromHash() {
    var h = window.location.hash.substring(2);
    console.log('load', h);
    var el = document.getElementById(h);
    if (el) {
        var d = el.data;


        selectedNode = d;
        populateProperties();
        var lst = root.querySelectorAll('.selected');
        if (lst && lst.length)
            lst[0].classList.remove('selected');
        el.classList.add('selected');
        root.parentNode.scrollTop = el.offsetTop - 5;
    }
}

window.addEventListener('hashchange', function () {
    setSelectionFromHash();
});

var root = document.getElementById('rootelm');
function loadData() {
    root.innerHTML = '';
    Json('/api', 'GET').then((d) => {
        parseNode(d, root);
        setSelectionFromHash();
    });
}
loadData();