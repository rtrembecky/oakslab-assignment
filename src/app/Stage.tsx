"use client"

import { Button, Stack, TextField, Typography } from "@mui/material"
import { Stages, Steps } from "./types"
import { FC, useState } from "react"
import { Step } from "./Step"

type StageProps = {
  label: string
  stages: Stages
  updateStages: (stages: Stages) => void
  previousStageLabel?: string
  nextStageLabel?: string
}

export const Stage: FC<StageProps> = ({ label, stages, updateStages, previousStageLabel, nextStageLabel }) => {
  const [addingStep, setAddingStep] = useState(false)
  const [stepLabel, setStepLabel] = useState("")

  const done = () => {
    setSteps({ ...steps, [stepLabel]: false })
    setAddingStep(false)
    setStepLabel("")
  }

  const steps = stages[label]
  const setSteps = (steps: Steps) => updateStages({ ...stages, [label]: steps })

  const completed = Object.values(steps).every((value) => value)

  const previousStageSteps = previousStageLabel ? stages[previousStageLabel] : undefined
  const previousStageInProgress = previousStageSteps ? Object.values(previousStageSteps).some((value) => !value) : false

  const nextStageSteps = nextStageLabel ? stages[nextStageLabel] : undefined
  const nextStageInProgress = nextStageSteps ? Object.values(nextStageSteps).some((value) => value) : false

  const lockedCheckboxes = previousStageInProgress || nextStageInProgress
  const canAddSteps = !nextStageInProgress

  return (
    <Stack>
      <Stack direction="row" gap={2}>
        <Typography variant="h4">{label}</Typography>
        <Typography variant="h4">{completed && "✓"}</Typography>
      </Stack>
      {Object.keys(steps).map((label, index) => (
        <Step
          key={index}
          label={label}
          value={steps[label]}
          onChange={(value) => setSteps({ ...steps, [label]: value })}
          locked={lockedCheckboxes}
        />
      ))}
      {canAddSteps &&
        (!addingStep ? (
          <div>
            <Button variant="outlined" onClick={() => setAddingStep(true)}>
              + Add step
            </Button>
          </div>
        ) : (
          <Stack direction="row" gap={2}>
            <TextField
              autoFocus
              placeholder="New step"
              onChange={(e) => setStepLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") done()
              }}
            />
            <Button variant="outlined" onClick={done}>
              Done
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setAddingStep(false)
                setStepLabel("")
              }}
            >
              Cancel
            </Button>
          </Stack>
        ))}
    </Stack>
  )
}
