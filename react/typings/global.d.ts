declare global {
  interface AddressFormFields {
    [key: string]: {
      value: null | string | number | number[]
      valid?: boolean
      geolocationAutoCompleted?: boolean
      postalCodeAutoCompleted?: boolean
    }
  }
}
export {}
