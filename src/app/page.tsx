"use client"

import { Button, CircularProgress, Container, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { Stages } from "./types"
import { Stage } from "./Stage"
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from "./localStorage"

const defaultStages: Stages = {
  Foundation: { "Setup virtual office": true, "Set mission and vision": true, "Select business name": true },
  Discovery: { "Create roadmap": true, "Competitor analysis": false },
  Delivery: { "Release marketing website": false, "Release MVP": false },
}

// TODO:
// - remove steps
// - add stage

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

  const stageLabels = useMemo(() => (stages ? Object.keys(stages) : []), [stages])

  const [fact, setFact] = useState("")

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
          stageLabels.map((label, index) => (
            <Stage
              key={index}
              label={label}
              stages={stages}
              updateStages={updateStages}
              previousStageLabel={stageLabels[index - 1]}
              nextStageLabel={stageLabels[index + 1]}
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

      {fact && (
        <Container sx={{ mt: 8, textAlign: "center" }}>
          <Typography>{fact}</Typography>
        </Container>
      )}
    </Stack>
  )
}
