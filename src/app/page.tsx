"use client"

import { Button, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { Stages } from "./types"
import { Stage } from "./Stage"
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from "./localStorage"

const defaultStages: Stages = {
  Foundation: { "Setup virtual office": true, "Set mission and vision": true, "Select business name": true },
  Discovery: { "Create roadmap": true, "Competitor analysis": false },
  Delivery: { "Release marketing website": false, "Release MVP": false },
}

const fetchRandomFact = async () => await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random")

export default function Home() {
  const [stages, setStages] = useState<Stages>()

  const updateStages = (stages: Stages) => {
    setStages(stages)
    saveToLocalStorage(stages)
  }

  useEffect(() => {
    const storage = loadFromLocalStorage()
    if (storage) setStages(storage)
    else setStages(defaultStages)
  }, [])

  const clearStages = () => updateStages({})
  const resetStages = () => updateStages(defaultStages)

  const [addingStage, setAddingStage] = useState(false)
  const [stageLabel, setStageLabel] = useState("")

  const done = () => {
    setStages({ ...stages, [stageLabel]: {} })
    setAddingStage(false)
    setStageLabel("")
  }

  const [fact, setFact] = useState("")

  const stageLabels = useMemo(() => (stages ? Object.keys(stages) : []), [stages])

  useEffect(() => {
    if (!stages) return

    const completed = stageLabels.every((label) => {
      const steps = stages[label]
      return Object.values(steps).every((value) => value)
    })

    if (completed) {
      fetchRandomFact()
        .then((response) => response.json())
        .then((data) => setFact(data.text))
    } else {
      setFact("")
    }
  }, [stageLabels, stages])

  return (
    <Stack component="main" sx={{ minHeight: "100vh" }}>
      <Container>
        {!stages ? (
          <CircularProgress />
        ) : (
          <>
            {stageLabels.map((label, index) => (
              <Stage
                key={index}
                label={label}
                stages={stages}
                updateStages={updateStages}
                previousStageLabel={stageLabels[index - 1]}
                nextStageLabel={stageLabels[index + 1]}
              />
            ))}
            {!addingStage ? (
              <div>
                <Button variant="outlined" onClick={() => setAddingStage(true)}>
                  + Add stage
                </Button>
              </div>
            ) : (
              <Stack direction="row" gap={2}>
                <TextField
                  autoFocus
                  placeholder="New step"
                  onChange={(e) => setStageLabel(e.target.value)}
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
                    setAddingStage(false)
                    setStageLabel("")
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </>
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

      {fact && (
        <Container sx={{ mt: 8, textAlign: "center" }}>
          <Typography>{fact}</Typography>
        </Container>
      )}
    </Stack>
  )
}
