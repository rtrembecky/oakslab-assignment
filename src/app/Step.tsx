"use client"

import { Checkbox, FormControlLabel } from "@mui/material"
import { FC } from "react"

type StepProps = { label: string; value?: boolean; onChange: (value: boolean) => void; locked?: boolean }

export const Step: FC<StepProps> = ({ label, value, onChange, locked }) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />}
      label={label}
      disabled={locked}
    />
  )
}
