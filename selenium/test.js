require("chromedriver");
const {Builder, By, Key, until} = require('selenium-webdriver');
var assert = require("assert");
const sleep = require("sleep");
var credentials = require("./credentials");

var regIP = new RegExp("^192\.168\.[0-2]\.[0-9]{1,2}$");

(async function reboot(type, driver){
	try{
		await driver.findElement(By.id(type)).click();
		sleep.sleep(40);
	} catch(err){
		console.log(err)
	}
});

(async function switchOS(os, driver){
	try{
		await driver.findElement(By.css("option[" + os + "]")).click();
		await driver.findElement(By.id("switch")).click();
		sleep.sleep(40);
	} catch(err){
		console.log(err)
	}
});

(async function example() {
  //build driver
  let driver = await new Builder().forBrowser('chrome').build();
  try {
  	//navigate to pi controller page with google oauth
    await driver.get('http://www.localhost/piController');
    await driver.findElement(By.className("btn")).click();
    await driver.findElement(By.name("identifier")).sendKeys(credentials.email + Key.RETURN);
    sleep.sleep(2)
    await driver.findElement(By.name("password")).sendKeys(credentials.password + Key.RETURN);
    sleep.sleep(10)

    //test to see that the ip address has successfully been obtained.
    var ip = await driver.findElement(By.id("addressLabel")).getText();
    assert(regIP.test(ip))

    //for consistancy lets make sure to start on raspbian
    var currentOS = await driver.findElement(By.id("osLabel")).getText();
    if(currentOS !== "Raspbian"){
    	console.log("rebooting to raspbian")
    	await driver.findElement(By.css("option[value=Raspbian]")).click();
    	await driver.findElement(By.id("switch")).click();
    	sleep.sleep(33)
    	console.log("should be on raspbian now")
    }

    //reboot test
    console.log("attempting reboot")
    await driver.findElement(By.id("reboot")).click();
    sleep.sleep(32);
    console.log("done Rebooting")

    //rca test
    console.log("attempting to reboot on rca")
    await driver.findElement(By.id("rca")).click();
    sleep.sleep(32);
    console.log("reboot finished")

    //hdmi test
    console.log("attempting to reboot to hdmi")
    await driver.findElement(By.id("hdmi")).click();
	sleep.sleep(32);
	console.log("done rebooting")
    
    //test switching to kodi. Kodi takes longer to reboot, so more time is allocated to sleep
    console.log("attempting to switch to kodi")
    await driver.findElement(By.css("option[value=Kodi]")).click();
	await driver.findElement(By.id("switch")).click();
    sleep.sleep(37)
    var currentOS = await driver.findElement(By.id("osLabel")).getText();
    assert.equal(currentOS, "Kodi");
    console.log("successfully booted to kodi");

    //test switching to retropie. Retropie takes longer to reboot, so more time is allocated to sleep
    console.log("attempting to switch to retropie");
    await driver.findElement(By.css("option[value=Retropie]")).click();
	await driver.findElement(By.id("switch")).click();
    sleep.sleep(40)
    var currentOS = await driver.findElement(By.id("osLabel")).getText();
    assert.equal(currentOS, "Retropie");
    console.log("successfully booted to retropie")

    //test switching to Rasplex
    console.log("attempting to switch to rasplex")
    await driver.findElement(By.css("option[value=Rasplex]")).click();
	await driver.findElement(By.id("switch")).click();
    sleep.sleep(27);
    var currentOS = await driver.findElement(By.id("osLabel")).getText();
    assert.equal(currentOS, "Rasplex");
    console.log("successfully booted to rasplex");

    //finally test switching back to raspbian
    console.log("attempting to switch back to raspbian")
    await driver.findElement(By.css("option[value=Raspbian]")).click();
	await driver.findElement(By.id("switch")).click();
    sleep.sleep(33);
	var currentOS = await driver.findElement(By.id("osLabel")).getText();
    assert.equal(currentOS, "Raspbian");
    console.log("successfully booted to raspbian")

    //sleep for a few seconds just to take in what just happened
    console.log("successfully ran all tests. Browser will close in 7 seconds")
    sleep.sleep(7);

  } catch(err){
  	console.log(err)
  }finally {
    await driver.quit();
  }
})();

