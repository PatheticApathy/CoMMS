package nominatim

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func Search(query string, options Options, api string) ([]GeoData, error) {
	var geo []GeoData

	url := api + "/search?q=" + query + `&format=jsonv2` + options.stringify()

	client := &http.Client{}

	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}

	if resp.Status != "200 OK" {
		return nil, fmt.Errorf("could not complete request with status: %s", resp.Status)
	}

	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return nil, err
	}

	return geo, nil
}

// SearchStructred uses structered query to search for relevant geodata
func SearchStructured(query StructuredQuery, options Options, api string) ([]GeoData, error) {
	var geo []GeoData

	query_str := ``

	if query.Amenity != "" {
		query_str += (`&amenity=` + query.Amenity)
	}
	if query.County != "" {
		query_str += (`&county=` + query.County)
	}
	if query.Country != "" {
		query_str += (`&country=` + query.Country)
	}
	if query.City != "" {
		query_str += (`&city=` + query.City)
	}
	if query.PostalCode != 0 {
		query_str += fmt.Sprintf(`&postalcode=%d`, query.PostalCode)
	}
	if query.State != "" {
		query_str += (`&state=` + query.State)
	}
	if query.Street != "" {
		query_str += (`&street=` + query.Street)
	}

	url := fmt.Sprintf("%s/search?format=jsonv2%s%s", api, query_str, options.stringify())

	client := &http.Client{}

	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}

	if resp.Status != "200 OK" {
		return nil, fmt.Errorf("could not complete request with status: %s", resp.Status)
	}

	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return nil, err
	}

	return geo, nil
}

func Reverse(query ReverseQuery, options Options, api string) (GeoData, error) {
	var geo GeoData

	url := fmt.Sprintf("%s/reverse?lat=%f&lon=%f&format=jsonv2&zoom=%d%s", api, query.Lat, query.Lon, query.Zoom, options.stringify())

	client := &http.Client{}

	resp, err := client.Get(url)
	if err != nil {
		return geo, err
	}
	if resp.Status != "200 OK" {
		return geo, fmt.Errorf("could not complete request with status: %s", resp.Status)
	}

	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return geo, err
	}
	return geo, nil
}
