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
          setSortType((prevState) => !prevState)
        } else {
          const sorted = copy.sort(sortDsc)
          setStudentList(sorted)
          setSortType((prevState) => !prevState)
        }
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortType={sortType} />

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
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortType } = props
  return (
    <S.ToolbarContainer>
      <div style={Styles.mouseCursor} onClick={() => onItemClick("sort")}>
        <span>First Name</span>
        {sortType ? (
          <span>
            <FontAwesomeIcon icon="angle-up" />
          </span>
        ) : (
          <span>y</span>
        )}
      </div>
      <div>Search</div>
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
}

const Styles = {
  mouseCursor: {
    cursor: "pointer",
  },
}
