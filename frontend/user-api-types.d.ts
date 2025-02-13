export interface SignupParams {
  email: string,
  passwod: string,
  phone: string,
  username: string
}
//********************************* User related types ***********************************

export interface User {
    company: Company
    email: string
    firstname: Firstname
    id: number
    lastname: Lastname
    password: string
    phone: string
    role: Role
    site: Site
    username: string
    profilepicture: Profilepicture
  }
  
  export interface Company {
    String: string
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
  
  export interface Site {
    String: string
    Valid: boolean
  }

export interface Company {
  string: string
  valid: boolean
}

export interface Firstname {
  string: string
  valid: boolean
}

export interface Lastname {
  string: string
  valid: boolean
}

export interface Role {
  string: string
  valid: boolean
}

export interface Site {
  string: string
  valid: boolean
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
