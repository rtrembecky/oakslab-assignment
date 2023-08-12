"use client"

import { Button, CircularProgress, Container, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { Stages } from "./types"
import { Stage } from "./Stage"
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from "./localStorage"

const defaultStages: Stages = {
  Foundation: { "Setup virtual office": true, "Set mission and vision": true, "Select business name": true },
  Discovery: { "Create roadmap": true, "Competitor analysis": false },
  Delivery: { "Release marketing website": false, "Release MVP": false },
}

export default function Home() {
  const [stages, setStages] = useState<Stages>()

  const updateStages = (stages: Stages) => {
    setStages(stages)
    saveToLocalStorage(stages)
  }

  useEffect(() => {
    const storage = loadFromLocalStorage()

    if (storage != null) {
      setStages(storage)
    } else {
      setStages(defaultStages)
    }
  }, [])

  const clearStages = () => updateStages({})
  const resetStages = () => updateStages(defaultStages)

  return (
    <Stack component="main" sx={{ minHeight: "100vh" }}>
      <Container>
        {!stages ? (
          <CircularProgress />
        ) : (
          Object.keys(stages).map((label, index) => (
            <Stage
              key={index}
              label={label}
              steps={stages[label]}
              setSteps={(steps) => updateStages({ ...stages, [label]: steps })}
            />
          ))
        )}
      </Container>
      <Container>
        <Stack direction="row" gap={2} justifyContent="center">
          <Button variant="outlined" onClick={clearStages}>
            Clear stages
          </Button>
          <Button variant="outlined" onClick={resetStages}>
            Reset stages to default
          </Button>
          <Button variant="outlined" onClick={clearLocalStorage}>
            Clear local storage
          </Button>
        </Stack>
      </Container>
    </Stack>
  )
}
