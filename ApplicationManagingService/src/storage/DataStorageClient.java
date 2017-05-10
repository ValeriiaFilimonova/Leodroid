package storage;

import com.codesnippets4all.json.parsers.JSONParser;
import com.codesnippets4all.json.parsers.JsonParserFactory;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

public class DataStorageClient {
    private String PROTOCOL = "http";
    private String HOST = "localhost";
    private int PORT = 8888;

    private JsonParserFactory factory = JsonParserFactory.getInstance();

    public String getServiceName(String applicationName) {
        try {
            URI uri = new URI(PROTOCOL, null, HOST, PORT, "/storage/applications/" + applicationName + "/_service", null, null);
            HttpGet request = new HttpGet(uri);
            HttpClient httpClient = new DefaultHttpClient();
            HttpResponse response = httpClient.execute(request);

            if (HttpStatus.SC_NOT_FOUND == response.getStatusLine().getStatusCode()) {
                throw new ApplicationNotFoundException(applicationName);
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
            String serviceName = reader.readLine();

            reader.close();
            return serviceName;
        }
        catch (IOException | URISyntaxException ex) {
            throw new DataStorageClientException(ex);
        }
    }

    public Map<String, String> getServiceStatuses() {
        try {
            URI uri = new URI(PROTOCOL, null, HOST, PORT, "/storage/statuses/", null, null);
            HttpGet request = new HttpGet(uri);
            HttpClient httpClient = new DefaultHttpClient();
            HttpResponse response = httpClient.execute(request);

            BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
            String statuses = reader.readLine();
            JSONParser parser = factory.newJsonParser();

            return parser.parseJson(statuses);
        }
        catch (IOException | URISyntaxException ex) {
            throw new DataStorageClientException(ex);
        }
    }

    public void updateServiceStatus(String name, String status) {
        try {
            URI uri = new URI(PROTOCOL, null, HOST, PORT, "/storage/statuses/", null, null);
            BasicHeader header = new BasicHeader("Content-Type", "application/json");
            String data = String.format("{\"%s\":\"%s\"}", name, status);
            StringEntity entity = new StringEntity(data);

            HttpPatch request = new HttpPatch(uri) {{
                addHeader(header);
                setEntity(entity);
            }};
            HttpClient httpClient = new DefaultHttpClient();
            httpClient.execute(request);
        }
        catch (IOException | URISyntaxException ex) {
            throw new DataStorageClientException(ex);
        }
    }
}
