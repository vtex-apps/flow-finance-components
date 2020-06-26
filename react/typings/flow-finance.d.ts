export interface BusinessInformation {
  businessId: string
  name: string
  legalName: string
  email: string
  phoneNumber: string
  docType: string
  physicalDocFile?: File
  physicalDocFileName: string
}

export interface Address {
  addressId: string
  addressType: string
  city: string
  complement: string
  country: string
  geoCoordinates?: number[]
  receiverName?: string
  reference?: string
  neighborhood: string
  number: string
  postalCode: string
  state: string
  street: string
}

export interface PersonalInformation {
  idNumber: string
  maritalStatus: string
  pep: boolean
  lastName: string
  firstName: string
  docType: string
  physicalDocFile?: File
  physicalDocFileName: string
  virtualDocValue: string
  virtualDocExp?: string
  virtualDocIssuer?: string
  email: string
  phoneNumber: string
  accountOpener: boolean
}

export interface TOSAcceptance {
  date: string
  ip: string
  userAgent: string
}
