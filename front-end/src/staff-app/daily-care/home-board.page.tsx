import React, { useState, useEffect, useRef } from "react"
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
import { RolllStateType } from "shared/models/roll"
import _, { Dictionary } from "lodash"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentList, setStudentList] = useState<Person[]>()
  const [filtered, setFiltered] = useState<boolean>(false)
  const [sortType, setSortType] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>("first_name")
  const [filterBy, setFilterBy] = useState<ItemType>()
  const [filteredList, setFilteredList] = useState<Dictionary<Person[]>>()

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudentList(data?.students)
  }, [data])

  useEffect(() => {
    onToolbarAction("sort")
  }, [sortType, sortBy])

  useEffect(() => {
    setRollCount(initialRollCount)
  }, [isRollMode])

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

  useEffect(() => {
    if (!filtered) {
      setFilteredList(_.groupBy(studentList, "rollState"))
      setFiltered(true)
    }
    if (filterBy && filterBy.length) filterList(filterBy)
  }, [filterBy])

  const filterList = (filterBy: ItemType) => {
    if (filterBy === "all") {
      setStudentList(studentList)
    } else if (filterBy === "present") {
      setStudentList(filteredList?.present)
    } else if (filterBy === "late") {
      setStudentList(filteredList?.late)
    } else if (filterBy === "absent") {
      setStudentList(filteredList?.absent)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction, type?: ItemType) => {
    if (action === "exit") {
      setIsRollMode(false)
    } else if (action === "filter") {
      setFilterBy(type)
    }
  }

  const handleEmpty = () => {
    setStudentList(data?.students)
  }

  const initialRollCount = {
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
  }

  const [rollCount, setRollCount] = useState<RollCount>(initialRollCount)

  let stateList: StateList[] = [
    { type: "all", count: rollCount.presentCount + rollCount.absentCount + rollCount.lateCount },
    { type: "present", count: rollCount.presentCount },
    { type: "late", count: rollCount.lateCount },
    { type: "absent", count: rollCount.absentCount },
  ]

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
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} rollCount={rollCount} setRollCount={setRollCount} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} stateList={stateList} />
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

interface RollCount {
  presentCount: number
  absentCount: number
  lateCount: number
}

interface StateList {
  type: ItemType
  count: number
}

type ItemType = RolllStateType | "all"
