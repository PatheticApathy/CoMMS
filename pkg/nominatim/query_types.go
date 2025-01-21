package nominatim

import "fmt"

// Options are possible option for all queries
type Options struct {
	Addressdeatils bool
	Extratags      bool
	Namedetails    bool
}

func (o *Options) stringify() string {
	booltoint := func(b bool) int {
		if b {
			return 1
		}
		return 0
	}
	return fmt.Sprintf("&addressdetails=%d&extratags=%d&namedetails=%d", booltoint(o.Addressdeatils), booltoint(o.Extratags), booltoint(o.Namedetails))
}

// StructuredQuery contains the formatting for a structured query
type StructuredQuery struct {
	Amenity    string
	Street     string
	City       string
	County     string
	State      string
	Country    string
	PostalCode int64
}

// Constants represent different zoom levels for reverse lookup query
const (
	CONTINENT_SEA = 0
	COUNTRY       = 3
	STATE         = 5
	REGION        = 6
	COUNTY        = 8
	CITY          = 10
	TOWN          = 12
	VILLAGE       = 13
	NEIGHBOURHOOD = 14
	LOCALITY      = 15
	MAJORSTREET   = 16
	MINORSTREET   = 17
	BUILDING      = 18
)

// ReverseQuery contains structure for reverse query
type ReverseQuery struct {
	Lat float64
	Lon float64
	// Has constants to represent zoom level
	Zoom int
}
