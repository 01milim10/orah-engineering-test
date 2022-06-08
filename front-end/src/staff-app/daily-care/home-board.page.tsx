import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing } from "shared/styles/styles"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { sortFn } from "shared/helpers/sort"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import Toolbar, { ToolbarAction } from "../components/toolbar"
import { search } from "shared/helpers/search"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentList, setStudentList] = useState<Person[]>()
  const [sortType, setSortType] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("first_name")

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudentList(data?.students)
  }, [data])

  useEffect(() => {
    onToolbarAction("sort")
  }, [sortType, sortBy])

  const handleSearch = (query: string) => {
    if (query && query.length > 0) {
      if (studentList && studentList.length) {
        setStudentList(search(studentList, query))
      }
    }
  }

  const toggleSortType = () => {
    setSortType((prevState) => !prevState)
  }

  const onToolbarAction = (action: ToolbarAction, value?: string) => {
    if (value && value.length > 0) setSortBy(value)

    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort") {
      if (studentList && studentList.length) {
        const copy = [...studentList]
        if (sortType) {
          const sorted = sortFn(copy, sortBy, sortType)
          setStudentList(sorted)
        } else {
          const sorted = sortFn(copy, sortBy, sortType)
          setStudentList(sorted)
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
        <Toolbar onItemClick={onToolbarAction} sortType={sortType} handleSearch={handleSearch} handleEmpty={handleEmpty} toggleSortType={toggleSortType} />

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

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
}
