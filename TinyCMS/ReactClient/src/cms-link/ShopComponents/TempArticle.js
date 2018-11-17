
export const parseConfig = function (c) {
    var md = { "modelString": "125", "discount": 30, "resellerDiscount": 35, "deliveryWeek": 10, "glassMarginWidth": 0, "glassMarginPost": 71, "isWindowDoor": false, "fixed": false, "borderWidth": 200, "borderHeight": 200, "sprojsMul": 0, "sprojsSize": 31, "postSize": 71, "dividerSize": 156, "marginWidth": 20, "marginHeight": 20, "wood": false, "alu": false, "diameter": false, "customSize": false, "borderBottom": 0, "alignValue": 0, "kVMPrice": 0 },
        isCustom = false,
        size = -1,
        maxsize = -1;

    c.p.map((v, i) => {
        if (v.t == 'glassheight') {
            v.t = 'sizedrag';
            v.dropdownCnt = '#sizedd';
            v.sliderCnt = '#slg';
            v.vertical = 1;
        }
        if (v.id == 'maxsize') {
            maxsize = i;
            v.t = 'hidden';
        }
        if (v.id == 'storlek') {
            size = i;
            v.t = 'hidden';
        }
    });
    
    if (size != -1) {
        c.p.push({
            id: 'width',
            n: md.diameter ? 'Diameter' : (isCustom ? 'Bredd' : 'Karmbredd'),
            dropdownCnt: '#ddw',
            selecttext: 'Välj mått',
            sliderCnt: '#slw',
            format: function (v, short) {
                var mul = Math.pow(10, 4 - v.length);
                return (v * mul - md.marginWidth) + 'mm' + (short ? '' : ' (modulmått: ' + v + ')');
            },
            t: isCustom ? 'custominp' : 'sizedrag'
        });
        if (!md.diameter) {
            c.p.push({
                id: 'height',
                dropdownCnt: '#ddh',
                selecttext: 'Välj mått',
                sliderCnt: '#slh',
                vertical: 1,
                format: function (v, short) {
                    var mul = Math.pow(10, 4 - v.length);
                    return (v * mul - md.marginHeight) + 'mm' + (short ? '' : ' (modulmått: ' + v + ')');
                },
                n: (isCustom ? 'Höjd' : 'Karmhöjd'),
                t: isCustom ? 'custominp' : 'sizedrag'
            });
        }
        var widthalt = [];
        var heightalt = [];
        c.i.items.map((v, i) => {
            var pv = v.pv[size];
            v.pv.push(pv);
            v.pv.push(pv);
        });
        c.i.val[size].map((v, i) => {

            var s = v.length / 2;
            widthalt.push(v.substr(0, s));
            heightalt.push(v.substr(s));

        });
        c.i.val.push(widthalt);
        c.i.val.push(heightalt);
        c.i.d.push(widthalt);
        c.i.d.push(heightalt);
    }
    
    if (maxsize != -1) {
        c.p.push({
            id: 'maxwidth',
            n: 'Maxbredd',
            t: 'custominp'
        });
        c.p.push({
            id: 'maxheight',
            n: 'Maxhöjd',
            t: 'custominp'
        });
        var maxwidthalt = [];
        var maxheightalt = [];
        c.i.items.map((v, i) => {
            var pv = v.pv[maxsize];
            v.pv.push(pv);
            v.pv.push(pv);

        });
        c.i.val[size].map((v, i) => {
            var s = v.length / 2;
            maxwidthalt.push(v.substr(0, s));
            maxheightalt.push(v.substr(s));
        });
        c.i.val.push(maxwidthalt);
        c.i.val.push(maxheightalt);
        c.i.d.push(maxwidthalt);
        c.i.d.push(maxheightalt);
    }

    return c;
};