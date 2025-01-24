package nominatim

import (
	"encoding/json"
	"strings"
	"testing"
)

const (
	API_URL              = "https://nominatim.openstreetmap.org"
	SearchShreveportJson = `[
  {
    "place_id": 308856190,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "relation",
    "osm_id": 132139,
    "lat": "32.5135356",
    "lon": "-93.7477839",
    "category": "boundary",
    "type": "administrative",
    "place_rank": 16,
    "importance": 0.590542566507485,
    "addresstype": "city",
    "name": "Shreveport",
    "display_name": "Shreveport, Caddo Parish, Louisiana, United States",
    "boundingbox": [
      "32.3326915",
      "32.5898665",
      "-93.9478451",
      "-93.6797150"
    ]
  },
  {
    "place_id": 308067263,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 34257612,
    "lat": "32.476479499999996",
    "lon": "-93.85923929564105",
    "category": "boundary",
    "type": "administrative",
    "place_rank": 16,
    "importance": 0.186731554894331,
    "addresstype": "city",
    "name": "Shreveport",
    "display_name": "Shreveport, Caddo Parish, Louisiana, United States",
    "boundingbox": [
      "32.4710580",
      "32.4819200",
      "-93.8656720",
      "-93.8396490"
    ]
  }
]`
	STRUCTREDSHREVEPORTJSON = `
  [
  {
    "place_id": 308856190,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "relation",
    "osm_id": 132139,
    "lat": "32.5135356",
    "lon": "-93.7477839",
    "category": "boundary",
    "type": "administrative",
    "place_rank": 16,
    "importance": 0.590542566507485,
    "addresstype": "city",
    "name": "Shreveport",
    "display_name": "Shreveport, Caddo Parish, Louisiana, United States",
    "boundingbox": [
      "32.3326915",
      "32.5898665",
      "-93.9478451",
      "-93.6797150"
    ]
  },
  {
    "place_id": 309435206,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 34257454,
    "lat": "32.418931",
    "lon": "-93.80463015328468",
    "category": "boundary",
    "type": "administrative",
    "place_rank": 16,
    "importance": 0.186731554894331,
    "addresstype": "city",
    "name": "Shreveport",
    "display_name": "Shreveport, Caddo Parish, Louisiana, United States",
    "boundingbox": [
      "32.4174080",
      "32.4202960",
      "-93.8059360",
      "-93.8032450"
    ]
  }
  ]
  `
	REVERSESHRVEPORT = `{
  "place_id": 308856190,
  "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
  "osm_type": "relation",
  "osm_id": 132139,
  "lat": "32.5135356",
  "lon": "-93.7477839",
  "category": "boundary",
  "type": "administrative",
  "place_rank": 16,
  "importance": 0.590542566507485,
  "addresstype": "city",
  "name": "Shreveport",
  "display_name": "Shreveport, Caddo Parish, Louisiana, United States",
  "address": {
    "city": "Shreveport",
    "county": "Caddo Parish",
    "state": "Louisiana",
    "ISO3166-2-lvl4": "US-LA",
    "country": "United States",
    "country_code": "us"
  },
  "boundingbox": [
    "32.3326915",
    "32.5898665",
    "-93.9478451",
    "-93.6797150"
  ]
}`
)

var (
	free_search       []GeoData
	structured_search []GeoData
	reverse_search    GeoData
)

func compare(data GeoData, temp GeoData, t *testing.T) {
	if data.PlaceId != temp.PlaceId {
		t.Fatalf("Error: expected place_id: %d got %d", temp.PlaceId, data.PlaceId)
	}
	if data.OsmType != temp.OsmType {
		t.Fatalf("Error: expected osm_type: %s got %s", temp.OsmType, data.OsmType)
	}
	if data.OsmId != temp.OsmId {
		t.Fatalf("Error: expected osm_id: %d got %d", temp.OsmId, data.OsmId)
	}
	for i, box_coord := range data.BoundingBox {
		if box_coord != temp.BoundingBox[i] {
			t.Fatalf("Error: expected bonding box coord %d: %s got %s", i, data.BoundingBox[i], box_coord)
		}
	}
	if data.DisplayName != temp.DisplayName {
		t.Fatalf("Error: expected display_name: %s got %s", temp.DisplayName, data.DisplayName)
	}
	if data.Type != temp.Type {
		t.Fatalf("Error: expected type: %s got %s", temp.Type, data.Type)
	}
	if data.AddressType != temp.AddressType {
		t.Fatalf("Error: expected address_type: %s got %s", temp.AddressType, data.Type)
	}
	if data.Class != temp.Class {
		t.Fatalf("Error: expected class: %s got %s", temp.Class, data.Class)
	}
	if data.AddressType != temp.AddressType {
		t.Fatalf("Error: expected address type: %s got %s", temp.AddressType, data.AddressType)
	}
	if data.Lat != temp.Lat {
		t.Fatalf("Error: expected lat: %s got %s", temp.Lat, data.Lat)
	}
	if data.Lon != temp.Lon {
		t.Fatalf("Error: expected lon: %s got %s", temp.Lon, data.Lon)
	}
	if data.Icon != temp.Icon {
		t.Fatalf("Error: expected icon: %s got %s", temp.Icon, data.Icon)
	}
	for key, value := range data.Address {
		if val_t, ok := temp.Address[key]; !ok || val_t != value {
			t.Fatalf("Error: expected address[%s] : %s got %s", key, val_t, value)
		}
	}
	for key, value := range data.ExtraTags {
		if val_t, ok := temp.ExtraTags[key]; !ok || val_t != value {
			t.Fatalf("Error: expected extratags[%s] : %s got %s", key, val_t, value)
		}
	}
	for key, value := range data.NameDetails {
		if val_t, ok := temp.ExtraTags[key]; !ok || val_t != value {
			t.Fatalf("Error: expected namedetails[%s] : %s got %s", key, val_t, value)
		}
	}
}

func TestMain(m *testing.M) {
	json.NewDecoder(strings.NewReader(SearchShreveportJson)).Decode(&free_search)
	if len(free_search) == 0 {
		panic("Checklist free empty")
	}
	json.NewDecoder(strings.NewReader(STRUCTREDSHREVEPORTJSON)).Decode(&structured_search)
	if len(structured_search) == 0 {
		panic("Checklist structured empty")
	}
	json.NewDecoder(strings.NewReader(REVERSESHRVEPORT)).Decode(&reverse_search)
	m.Run()
}

func TestSearch(t *testing.T) {
	query := "Shreveport"

	options := Options{
		Addressdeatils: false,
		Extratags:      false,
		Namedetails:    false,
	}

	t.Logf("Making unstructured search request to %s", API_URL)

	geo_data, err := Search(query, options, API_URL)
	if err != nil {
		t.Fatal(err)
	}

	if len(geo_data) == 0 {
		t.Fatalf("Empty array")
	}

	for i, data := range geo_data {
		compare(data, free_search[i], t)
	}
}

func TestSearchStructured(t *testing.T) {
	query := StructuredQuery{
		City:       "Shreveport",
		County:     "US",
		State:      "LA",
		PostalCode: 71108,
	}

	options := Options{
		Addressdeatils: false,
		Extratags:      false,
		Namedetails:    false,
	}

	t.Logf("Making structured search request to %s", API_URL)

	geo_data, err := SearchStructured(query, options, API_URL)
	if err != nil {
		t.Fatal(err)
	}

	if len(geo_data) == 0 {
		t.Fatalf("Empty array")
	}

	for i, data := range geo_data {
		compare(data, structured_search[i], t)
	}
}

func TestReverse(t *testing.T) {
	query := ReverseQuery{
		Lat:  32.46137,
		Lon:  -93.81378,
		Zoom: CITY,
	}
	options := Options{
		Addressdeatils: false,
		Extratags:      false,
		Namedetails:    false,
	}

	t.Logf("Making reverse lookup request to %s", API_URL)

	geo_data, err := Reverse(query, options, API_URL)
	if err != nil {
		t.Fatal(err)
	}

	compare(geo_data, reverse_search, t)
}
