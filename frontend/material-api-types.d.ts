//********************************* Checkout related types ***********************************

export interface CheckoutLog {
  checkin_time: CheckinTime
  checkout_time: string
  id: number
  item_id: number
  user_id: number
}

export interface AddCheckoutLog {
  item_id: number
  user_id: number
}

//*********************************** Material related types ***********************************

export interface AddMaterial {
  job_site: JobSite
  location_lat: LocationLat
  location_lng: LocationLng
  name: Name
  quantity: number
  status: string
  type: Type
  unit: string
}
export interface Material {
  id: number
  job_site: JobSite
  last_checked_out: string
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

export interface JobSite {
  Int64: number
  Valid: boolean
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

//**************************** Jobsite related types ***************************

export interface Jobsite {
  addr: Addr
  location_lat: LocationLat
  location_lng: LocationLng
  name: string
}

export interface Addr {
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
  time: string
  Valid: boolean
}
