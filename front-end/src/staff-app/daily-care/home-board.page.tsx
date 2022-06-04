import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { faCoffee } from "@fortawesome/free-solid-svg-icons"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentList, setStudentList] = useState<Person[]>()
  const [sortType, setSortType] = useState(false)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudentList(data?.students)
  }, [data])

  const sortAsc = (a: Person, b: Person) => {
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) return 1
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) return -1
    return 0
  }

  const sortDsc = (a: Person, b: Person) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) return 1
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) return -1
    return 0
  }

  const handleSearch = (query: string) => {
    if (query && query.length > 0) {
      if (studentList && studentList.length) {
        setStudentList(studentList.filter((s) => s.first_name.concat(" ", s.last_name).toLowerCase().match(query.toLowerCase())))
      }
    }
  }

  const toggleSortType = () => {
    setSortType((prevState) => !prevState)
  }

  const onToolbarAction = (action: ToolbarAction, value?: string) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort") {
      if (studentList && studentList.length) {
        const copy = [...studentList]
        if (sortType) {
          const sorted = copy.sort(sortAsc)
          setStudentList(sorted)
          toggleSortType()
        } else {
          const sorted = copy.sort(sortDsc)
          setStudentList(sorted)
          toggleSortType()
        }
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const handleEmpty = () => {
    setStudentList(data?.students)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortType={sortType} handleSearch={handleSearch} handleEmpty={handleEmpty} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentList && (
          <>
            {studentList?.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortType: boolean
  handleSearch: (query: string) => void
  handleEmpty: () => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortType, handleSearch, handleEmpty } = props
  const [query, setQuery] = useState<string>("")

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <S.ToolbarContainer>
      <div style={Styles.mouseCursor} onClick={() => onItemClick("sort")}>
        <span>First Name</span>
      </div>
      <div>
        <input
          style={Styles.searchBar}
          type="text"
          value={query}
          onInput={handleOnChange}
          onKeyUp={() => {
            handleSearch(query)
            if (query.trim().length == 0) {
              handleEmpty()
            }
          }}
          placeholder="Search here ..."
        ></input>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Input: styled.input`
    padding: ${Spacing.u2};
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
}

const Styles = {
  mouseCursor: {
    cursor: "pointer",
  },
  searchBar: {
    paddingLeft: 5,
    outerHeight: 20,
    BorderRadius: 5,
  },
}
