var fs = require('fs');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var driver = new webdriver.Builder().forBrowser('firefox').build();
var jsonData;
var FILE_PATH;
var WEBSITE;
var KEYS_WEBSITE;
fs.readFile('props.txt', 'utf8', function(err, props) {
    if (err) throw err;
    var propsData = JSON.parse(props);
    WEBSITE = propsData["WEBSITE"];
    KEYS_WEBSITE = propsData["KEYS_WEBSITE"];
    FILE_PATH = propsData["FILE_PATH"];
    log('Website: '+WEBSITE);
    log('File Path: '+FILE_PATH);
    init();
});

function init() {
    driver.get(WEBSITE);
    driver.getTitle().then(checkPageLoad);
    fs.readFile(FILE_PATH, 'utf8', function(err, data) {
        if (err) throw err;
        jsonData = JSON.parse(data);
        jsonData['news'] = {};
        jsonData['keys'] = {};
    });
}

function checkPageLoad(title) {
    log("Website loaded...")
    log(title);
    log("--------- Looking for notifications container ---------");
    readNotifications();
}

function readNotifications() {
    driver.findElement(By.className('arrow-list ')).then(readNotificationsContainer);
}

function readNotificationsContainer(container) {
    container.findElements(By.tagName('li')).then(readNotificationsList);
}

function readNotificationsList(list) {
    var index = list.length;
    list.forEach(function(li) {
        li.findElement(By.tagName('a')).then(function(a) {
            a.getAttribute('href').then(function(ref) {
                a.getText().then(function(text) {
                    var obj = {};
                    var txt = format(text);
                    var urlObj = {
                        "url": ""
                    };
                    urlObj.url = ref;
                    var key = index-- + "::" + txt;
                    jsonData.news[key] = urlObj;
                    if (index == 0) {
                        log('---------  Completed Notifications Section ---------');
                        readKeys();
                    }
                })
            });
        });
    });
}

function readKeys() {
    log('--------- Reading Keys Section --------- ');
    driver.get(KEYS_WEBSITE);
    driver.findElement(By.xpath("//*[contains(@class, 'arrow-list')]/ul")).then(readKeysContainer);
}

function readKeysContainer(container) {
    container.findElements(By.tagName('li')).then(readKeysList);
}

function readKeysList(list) {
    var index = list.length;
    list.forEach(function(li) {
        li.findElement(By.tagName('a')).then(function(a) {
            a.getAttribute('href').then(function(ref) {
                a.getText().then(function(text) {
                    var obj = {};
                    var txt = format(text);
                    if(ref.indexOf("http") == -1){
                        txt = WEBSITE+txt;
                    }
                    var url = ref;
                    var key = index-- + "::" + txt;
                    jsonData.keys[key] = url;
                    if (index == 0) {
                        fs.writeFile('tspsc-export.json', JSON.stringify(jsonData), function(err) {
                            if (err) throw err;
                            log('---------  Completed Keys Section ---------');
                            log('--------- Keys content writen to file ---------');
                            driver.quit();
                        });
                    }
                })
            });
        });
    });
}

function log(text) {
    console.log(text);
}

function format(text) {
    return text.replace(/\//g, '-').replace(/\./g, "").replace(/\\n/g,'').replace('/\\n','');
}