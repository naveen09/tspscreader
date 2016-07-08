var fs = require('fs');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
var jsonData;

driver.get('http://tspsc.gov.in');
driver.getTitle().then(function(title){
  log("TSPSC Page loaded...")
  log(title);
  log("--------- Looking for notifications container...--------");
});

fs.readFile('tspsc-export.json', 'utf8', function (err, data) {
  if (err) throw err;
  jsonData = JSON.parse(data);
  jsonData['news'] = "";
  log('################################################')
});

driver.findElement(By.className('arrow-list')).then(readNotificationsContainer);

function readNotificationsContainer(container){
  container.findElements(By.tagName('li')).then(readNotificationsList);
}

function readNotificationsList(list){
  var newsJson = "";
  var index = 0;
  list.forEach(function(li){
    li.findElement(By.tagName('a')).then(function(a){
      a.getAttribute('href').then(function(ref){
        a.getText().then(function(text){
          var txt = text.replace(/\//g,'-').replace(/\./g,"");
          newsJson += "\""+(++index)+"::"+txt+"\":{\"url\":\""+ref+"\"}"
          if(index == list.length){
            log(newsJson);
          }else{
            newsJson+=",";
          }
        })
      });
    });
  });
}

// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.quit();

function log(text){
  console.log(text);
}
