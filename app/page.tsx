'use client'

import { Button, Stack, Typography } from '@mui/material'

export default function Home() {
  return (
    <Stack spacing={2} alignItems="center" mt={10}>
      <Typography variant="h4">
        P2P Chat Demo
      </Typography>
      <Button variant="contained">
        Start
      </Button>
    </Stack>
  )
}
