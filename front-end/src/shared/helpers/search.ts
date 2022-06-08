import { Person } from "shared/models/person"

export const search = (studentList: Person[], query: string) => {
  return studentList.filter((s) => s.first_name.concat(" ", s.last_name).toLowerCase().match(query.toLowerCase()))
}
