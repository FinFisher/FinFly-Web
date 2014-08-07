Initial Glances
===============

Huh. An exploit that pretends to be a Java plugin. Feels rather familiar in
spirit to a recent exploit on the Tor Browser Bundle. From the xpi
(conincidentally, I'm pretty sure this is an add-on/extension, not a
bonafide plugin):

file: chrome/content/Java_Plugin.js

    function doSomethingWhenBrowserIsStarted() {
        doSomethingAtEachPageLoadOrMore();
    }

    function doSomethingAtEachPageLoadOrMore() {

    ... etc etc

I guess "doSomethingWhenBrowserIsStarted()" could be anything, like... send
the victim's MAC and IP addresses to an IP address located in the
Washington metropolitan area... At this point in the code, lots of javascript
could do some basic finger printing.

But ultimately, the code just trys to spawn a separate process that executes
what is (presumably) the payload in "java_plugin.exe", also located in the xpi.
Given the filename, I'd guess that the exploit is Windows specific. There's
also some basic checks in the chrome/content/Java_Plugin.js file that are
commented out:

        //if (! file.isExecutable()) {
        //      alert("file not executable: " +path);
        //      return false;
        //}

Supressing error messages and silently failing is par for the course I guess
--wouldn't want the target to get suspicious-- but strangely though, not all
errors are silent:

        if (!file.exists()) {
            alert("file not found: " + path);
            return false;
        }

Granted, this looks like a sort-of demo that would be given out to prospective
clients prior to being completely obfuscated.

Functional?
===========

If one visits the index.html page in their browser and has enabled scripts,
then you are indeed prompted to install a missing plugin. (Just another
reason to always run NoScript.)

But... it looks like the index.html calls a maliciously-named
"google-analytics.js" which proceeds to generate a fake "plugin install"
prompt, as evidenced by assets in the mozilla/ directory. It is disguised
to look like a MS Windows window, with the typical blue-gradient title bar,
and even makes an attempt to mimic the behaviour of a separate window: you
can click and drag the "window," even though it doesn't appear as a separate
window in the start bar (or whatever MS is calls it) and will not escape the
bounds of the browsing window. As well, the checkbox can be toggled, and the
"next" button will toggle appropriately:

![ffw-dialog](https://i.imgur.com/y5edoPh.png)

Upon having the "Java Update" checked and clicking "next," the code ultimately
tries to run the `doIt()` function in google-analytics.js, which tries to
trigger an installation of the xpi. In FF 31 on Linux, this fails with a
warning from the browser:

![ffw-install-fail](https://i.imgur.com/mCf8rLs.png)

The extracted plugin itself appears to be an exe file:

    $ mkdir extracted
    $ unzip Java_Plugin.xpi -d extracted/
    $ file extracted/java_plugin.exe
    extracted/java_plugin.exe: PE32 executable (GUI) Intel 80386 Mono/.Net assembly, for MS Windows

In any case, it all looks pretty fascinating to me. But it's been over a
decade since I've reversed any windows stuff. Anyone else up for it? Surely
at some point the installation must have been successful (on older versions of
Firefox) and at that point the addon would attempt to launch the payload:

File: chrome/content/Java_Plugin.js (starting at line 56)

    var process = Components.classes["@mozilla.org/process/util;1"]
      .createInstance(Components.interfaces.nsIProcess);
    process.init(file);
    process.run(false, argsArray, argsArray.length);


