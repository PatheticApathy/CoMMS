//********************************* User related types ***********************************

export interface User {
  company_id: CompanyID
  email: string
  firstname: Firstname
  id: number
  lastname: Lastname
  password: string
  phone: string
  role: Role
  jobsite_id: JobSiteID
  username: string
  profilepicture: Profilepicture
}


export interface UpdateProfileParams {
  firstname: Firstname
  lastname: { Valid: boolean, String: string }
  username: { Valid: boolean, String: string }
  email: { Valid: boolean, String: string }
  phone: { Valid: boolean, String: string }
  ID: number
}

export interface GetUserRow {
  id: number
  username: string
  firstname: { Valid: boolean, String: string }
  lastname: { Valid: boolean, String: string }
  company_id: { Valid: boolean, Int64: number }
  jobsite_id: { Valid: boolean, Int64: number }
  role: { Valid: boolean, String: string }
  email: string
  phone: string
  profilepicture: { Valid: boolean, String: string }
}

export interface TokenStr {
  token: string
}

export interface Token {
  id: number
  password: string
  role: { String: string, Valid: boolean }
  username: string
}

export interface CompanyID {
  Int64: number
  Valid: boolean
}

export interface Firstname {
  String: string
  Valid: boolean
}

export interface Lastname {
  String: string
  Valid: boolean
}

export interface Role {
  String: string
  Valid: boolean
}

export interface JobSiteID {
  Int64: number
  Valid: boolean
}

export interface Profilepicture {
  String: string
  Valid: boolean
}

export interface SignUpUser {
  email: string
  password: string
  phone: string
  username: string
}

export interface LogInUser {
  username: string
  password: string
}

export interface UpdateUserParams {
  username: { String: string, Valid: boolean }
  password: { String: string, Valid: boolean }
  firstname: { String: string, Valid: boolean }
  lastname: { String: string, Valid: boolean }
  role: { String: string, Valid: boolean }
  email: { String: string, Valid: boolean }
  phone: { String: string, Valid: boolean }
  profilepicture: string
  jobsite_id: JobSiteID
  company_id: CompanyID
}

export interface LocationLat {
  Float64: number
  Valid: boolean
}

export interface LocationLng {
  Float64: number
  Valid: boolean
}

export interface Company {
  id: number
  name: string
  addr: { String: string, Valid: boolean }
  location_lat: LocationLat
  location_lng: LocationLng
}

export interface AddCompanyParams {
  name: string
  addr: { String: string, Valid: boolean }
  location_lat: LocationLat
  location_lng: LocationLng
}

export interface JobSite {
  id: number
  name: string
  addr: { String: string, Valid: boolean }
  location_lat: LocationLat
  location_lng: LocationLng
  company_id: CompanyID
}

export interface AddJobSiteParams {
  name: string
  addr: { String: string, Valid: boolean }
  location_lat: LocationLat
  location_lng: LocationLng
  company_id: CompanyID
}

export interface UserJoin {
  company_id: CompanyID
  email: string
  firstname: Firstname
  id: number
  lastname: Lastname
  password: string
  phone: string
  role: Role
  jobsite_id: JobSiteID
  username: string
  profilepicture: Profilepicture
  company_name: { String: string; Valid: boolean }
  jobsite_name: { String: string; Valid: boolean }
}
