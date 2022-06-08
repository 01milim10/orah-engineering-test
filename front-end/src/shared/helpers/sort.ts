import { Person } from "shared/models/person"

export type sort = (a: Person, b: Person) => number
export type sortFn = (StudentList: Person[], sortBy: string, sortType: boolean) => Person[]

export const sortFn: sortFn = (studentList, sortBy, sortType) => {
  const sortAsc: sort = (a, b) => {
    if (sortBy === "first_name") {
      if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) return 1
      if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) return -1
      return 0
    } else {
      if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) return 1
      if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) return -1
      return 0
    }
  }

  const sortDsc: sort = (a, b) => {
    if (sortBy === "first_name") {
      if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) return 1
      if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) return -1
      return 0
    } else {
      if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) return 1
      if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) return -1
      return 0
    }
  }

  if (sortType) {
    studentList.sort(sortAsc)
  } else studentList.sort(sortDsc)

  return studentList
}
