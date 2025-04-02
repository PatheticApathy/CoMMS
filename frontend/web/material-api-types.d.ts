//********************************* Checkout related types ***********************************

export interface CheckoutLog {
  checkin_time: CheckinTime
  checkout_time: string
  id: number
  item_id: number
  user_id: number
  amount: number
  checkout_picture: string
  checkin_picture: string
}

export interface AddCheckoutLog {
  item_id: number
  user_id: number
}

//*********************************** Material related types ***********************************

export interface AddMaterial {
  job_site: number
  location_lat: LocationLat
  location_lng: LocationLng
  name: Name
  quantity: number
  status: string
  type: Type
  unit: string
  picture: { Valid: bool, String: string }
}
export interface Material {
  id: number
  job_site: number
  last_checked_out: { Valid: bool, Time: string }
  location_lat: LocationLat
  location_lng: LocationLng
  name: Name
  quantity: number
  status: string
  type: Type
  unit: string
}

export interface ChangeQuantity {
  id: number
  quantity: number
}
export enum MaterialStatus {
  InStock = "In Stock",
  OutOfStock = "Out of Stock",
  LowStock = "Low Stock"
}

export interface Name {
  String: string
  Valid: boolean
}

export interface Type {
  String: string
  Valid: boolean
}


//**************************  Material logs related types ****************************

export interface AddMaterialLog {
  material_id: number
  note: Note
  quantity_change: number
  status: string
}

export interface MaterialLog {
  id: number
  material_id: number
  note: Note
  quantity_change: number
  status: string
  timestamp: string
}

export interface AddNoteToMaterialLog {
  id: number
  note: Note
}

export interface Note {
  String: string
  Valid: boolean
}

//**************************misc******************

export interface LocationLat {
  Float64: number
  Valid: boolean
}

export interface LocationLng {
  Float64: number
  Valid: boolean
}

export interface CheckinTime {
  Time: string
  Valid: boolean
}
