import React, { useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"

export type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  sortType: boolean
  handleSearch: (query: string) => void
  handleEmpty: () => void
  toggleSortType: () => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, sortType, handleSearch, handleEmpty, toggleSortType } = props
  const [query, setQuery] = useState<string>("")

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <S.ToolbarContainer>
      <div style={Styles.mouseCursor}>
        {sortType ? (
          <FontAwesomeIcon
            icon="angle-down"
            size="sm"
            onClick={() => {
              toggleSortType()
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon="angle-up"
            size="sm"
            onClick={() => {
              toggleSortType()
            }}
          />
        )}
        <span style={{ marginLeft: 5 }}>Sort By:</span>
        <S.Select onChange={(val) => onItemClick("sort", val.target.value)}>
          <S.Option value={"first_name"}>First Name</S.Option>
          <S.Option value={"last_name"}>Last Name</S.Option>
        </S.Select>
      </div>
      <div>
        <S.Input
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
        ></S.Input>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const Styles = {
  mouseCursor: {
    cursor: "pointer",
  },
}

const S = {
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
  Input: styled.input`
    padding: ${Spacing.u2};
    font-weight: ${FontWeight.normal};
    border-radius: ${BorderRadius.default};
  `,
  Select: styled.select`
    padding: ${Spacing.u2};
    font-weight: ${FontWeight.normal};
    border-radius: ${BorderRadius.default};
    margin-left: ${Spacing.u2};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Option: styled.option`
    padding: ${Spacing.u2};
    font-weight: ${FontWeight.normal};
    border-radius: ${BorderRadius.default};
  `,
}

export default Toolbar
