Initial Glances
===============

Huh. An exploit that pretends to be a Java plugin. Feels rather familiar in
spirit to a recent exploit on the Tor Browser Bundle. From the xpi:

file: chrome/content/Java_Plugin.js

    function doSomethingWhenBrowserIsStarted() {
        doSomethingAtEachPageLoadOrMore();
    }

    function doSomethingAtEachPageLoadOrMore() {

    ... etc etc

I guess "doSomethingWhenBrowserIsStarted()" could be anything, like... send
the victim's MAC and IP addresses to an IP address located in the
Washington metropolitan area...

Ultimately, it just trys to spawn a separate process that executes what is
(presumably) the payload in "java_plugin.exe", also located in the xpi. I
couldn't tell you whether this exploit would have to be windows specific or
not, but some of the code does at least seem to try and determine that:

        //if (! file.isExecutable()) {
        //      alert("file not executable: " +path);
        //      return false;
        //}

Supressing error messages and silently failing is par for the course I guess,
but strangely though, not all errors are silent:

        if (!file.exists()) {
            alert("file not found: " + path);
            return false;
        }

Huh. This'll be fun to play with. I'll try and probe it some more within a
VM at some point in the coming days.

Functional?
===========

If one visits the index.html page in their browser and has enabled scripts,
then you are indeed prompted to install a missing plugin. Just another
reason to always run NoScript.
