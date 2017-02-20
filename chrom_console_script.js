var jsonData = {};
jsonData['news'] = {};
jsonData['keys'] = {};
var list =document.getElementsByClassName('arrow-list ')[0].children;
var index = list.length;
for(var i = 0 ;i< list.length; i++){
	var ref = list[i].children[0].getAttribute('href');
	var text = list[i].children[0].innerHTML;
	var txt = text.replace(/\//g, '-').replace(/\./g, "").replace(/\\n/g,'').replace('/\\n','');
	var obj = {};
                    var urlObj = {"url": ""};
                    urlObj.url = ref;
                    var key = index-- + "::" + txt;
                    jsonData.news[key] = urlObj;
}
console.log(JSON.stringify(jsonData))


=============================================================

var jsonData = {};
jsonData['news'] = {};
jsonData['keys'] = {};
var list = document.getElementsByClassName("//*[contains(@class, 'arrow-list')]/ul")[0].children;
var index = list.length;
for (var i = 0; i < list.length; i++) {
    var ref = list[i].children[0].getAttribute('href');
    var text = list[i].children[0].innerHTML;
    var txt = text.replace(/\//g, '-').replace(/\./g, "").replace(/\\n/g, '').replace('/\\n', '');
    var txt = format(text);
    if (ref.indexOf("http") == -1) {
        txt = "http://tspsc.gov.in/TSPSCWEB0508/" + txt;
    }
    var url = ref;
    var key = index-- + "::" + txt;
    jsonData.keys[key] = url;
}
console.log(JSON.stringify(jsonData))