"use client"

import { Button, Stack, TextField, Typography } from "@mui/material"
import { Steps } from "./types"
import { FC, useState } from "react"
import { Step } from "./Step"

type StageProps = { label: string; steps: Steps; setSteps: (value: Steps) => void }

export const Stage: FC<StageProps> = ({ label, steps, setSteps }) => {
  const [addingStep, setAddingStep] = useState(false)
  const [stepLabel, setStepLabel] = useState("")

  const done = () => {
    setSteps({ ...steps, [stepLabel]: false })
    setAddingStep(false)
    setStepLabel("")
  }

  return (
    <Stack>
      <Typography variant="h4">{label}</Typography>
      {Object.keys(steps).map((label, index) => (
        <Step
          key={index}
          label={label}
          value={steps[label]}
          onChange={(value) => setSteps({ ...steps, [label]: value })}
        />
      ))}
      {!addingStep ? (
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
      )}
    </Stack>
  )
}
