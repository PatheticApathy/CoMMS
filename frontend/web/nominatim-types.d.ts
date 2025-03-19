export interface GeoData {
  place_id: number
  osm_type: string
  osm_id: number
  boundingbox: Array<string>
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  icon: string
  addresstype: string
  address: Map<string, string>
  extratags: Map<string, string>
  namedetails: Map<string, string>
}
