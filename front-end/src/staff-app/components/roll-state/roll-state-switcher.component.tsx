import React, { useEffect, useRef, useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  rollCount: RollCount
  setRollCount: (rollCount: RollCount) => void
}
interface RollCount {
  presentCount: number
  absentCount: number
  lateCount: number
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, setRollCount, rollCount }) => {
  const [rollState, setRollState] = useState(initialState)
  const [counter, setCounter] = useState(0)

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)

    if (counter === 0 && next === "present") {
      setRollCount({ ...rollCount, presentCount: rollCount.presentCount + 1 })
    } else {
      if (next === "present") {
        setRollCount({ ...rollCount, presentCount: rollCount.presentCount + 1, absentCount: rollCount.absentCount - 1 })
      } else if (next === "absent") {
        setRollCount({ ...rollCount, absentCount: rollCount.absentCount + 1, lateCount: rollCount.lateCount - 1 })
      } else {
        setRollCount({ ...rollCount, lateCount: rollCount.lateCount + 1, presentCount: rollCount.presentCount - 1 })
      }
    }

    if (onStateChange) {
      onStateChange(next)
    }
    setCounter((prevState) => ++prevState)
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
