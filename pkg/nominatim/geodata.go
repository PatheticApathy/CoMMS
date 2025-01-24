// Nominatim contains the interface for using the Nominatim geoddata api in go
package nominatim

// Geodata is what is returned form the Nominatim api
type GeoData struct {
	// PlaceId should not be relied on b/c it changes between servers,
	// Non perminent.
	PlaceId int64 `json:"place_id"`

	// Maps geodata to there OSM type and ID.
	// NOTE: Some data does not have a OSM type or id b/c they do not have an exact mapping
	OsmType string `json:"osm_type"`
	OsmId   int64  `json:"osm_id"`

	// NOTE: BoundingBox Can be used to center the map on the result
	BoundingBox []string `json:"boundingbox"`

	Lat string `json:"lat"`
	Lon string `json:"lon"`

	DisplayName string `json:"display_name"`

	// OSM class and type tags
	Class string `json:"class"`
	Type  string `json:"type"`

	Importance float64 `json:"importance"`

	// Icon is link to class icon if available
	Icon string `json:"icon"`

	AddressType string            `json:"addresstype"`
	Address     map[string]string `json:"address"`

	ExtraTags   map[string]string `json:"extratags"`
	NameDetails map[string]string `json:"namedetails"`
}
