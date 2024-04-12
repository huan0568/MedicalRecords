declare interface IUser {
  id: string
  name: string
  email: string
  avatar?: string
  age: number
  phone: string
}

declare interface IImageResult {
  title: string
  percent: number
}

interface IImages {
  id: string
  title: string
  url: string
}

declare interface IPatient extends IUser {
  address: string
  haveResult: boolean
  result: IImageResult[]
  doctor: string
  date: string
  gender: string
  images: IImages[]
  doctorComment?: string
}

declare interface IResFormat<T> {
  totalPages: number
  currentPage: number
  data: T[]
}

declare interface IResultOptions {
  value: number
  name: string
}
