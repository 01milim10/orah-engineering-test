export interface Person {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
  rollState: string
}

export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
}
