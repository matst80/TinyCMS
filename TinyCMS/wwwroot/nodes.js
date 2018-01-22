
var selectedNode;

function deleteNode() {
    Json('/api/' + selectedNode.id, 'DELETE').then((d) => {
        loadData();
    });
}

var prpCnt = document.getElementById('properties');
var deleteBtn = document.getElementById('deletenode');
deleteBtn.addEventListener('click', deleteNode);

function parseNode(d, prt) {
    var li = document.createElement('li');
    li.id = d.id;
    li.data = d;
    li.addEventListener('click', function (e) {
        window.location.hash = '/'+d.id;
        e.stopPropagation();

    });
    var span = document.createElement('span');
    span.innerHTML = d.type + ': ' + d.id;
    li.appendChild(span);
    prt.appendChild(li);
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

var excluded = ['id','children'];

var aceedit =  ['html','css','js'];

function populateProperties() {
    var d = selectedNode;
    prpCnt.innerHTML = '';
    for(i in d) {
        var val = d[i];
        if (excluded.indexOf(i)==-1) {
            var cnt = document.createElement('div');
            prpCnt.appendChild(cnt);
            
            var lbl = document.createElement('label');
            lbl.innerText = i;
            cnt.appendChild(lbl);
            if (i=='relations') {
                var ul = document.createElement('ul');
                val.map(function(d){
                    var li = document.createElement('ul');
                    
                    var span = document.createElement('span');
                    span.innerHTML = d.type + ': ' + d.id;
                    li.appendChild(span);
                    ul.appendChild(li);
                });
                cnt.appendChild(ul);
            }
            else if (aceedit.indexOf(i)==-1) {
                var inp = document.createElement('input');
                inp.value = val;
                cnt.appendChild(inp);
                inp.addEventListener('change',function() {
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
                if (i=='js')
                    tp = 'javascript';
                editor.session.setMode("ace/mode/"+tp);
                editor.session.setValue(val);
                editor.session.on('change',function() {
                    d[i] = editor.session.getValue();
                });
                
            }
        }
    }
    var btn = document.createElement('button');
    btn.innerText = 'Save';
    btn.addEventListener('click',function() {
        Json('/api/'+d.id,'PUT',d).then(function(d) {
            loadData();
        });
    });
    prpCnt.appendChild(btn);
}

function setSelectionFromHash() {
    var h = window.location.hash.substring(2);
    console.log('load',h);
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

window.addEventListener('hashchange',function() {
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