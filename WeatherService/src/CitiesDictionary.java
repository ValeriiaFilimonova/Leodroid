import java.util.Dictionary;
import java.util.Hashtable;

public class CitiesDictionary {
    private Dictionary<String, Integer> cities = new Hashtable<>();

    public CitiesDictionary() {
        cities.put("moscow", 5601538);
        cities.put("ivanovo", 6608392);
        cities.put("london", 2643743);
        cities.put("berlin", 2950159);
        cities.put("tokyo", 1850147);
    }

    public int getCodeByName(String name) {
        try {
            return cities.get(name);
        }
        catch (NullPointerException ex) {
            throw new IllegalArgumentException(String.format("Unknown city name {%s}", name));
        }
    }
}