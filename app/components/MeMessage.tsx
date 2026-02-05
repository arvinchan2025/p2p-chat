import {Avatar, Box, Stack, Typography} from "@mui/material";


const MeMessage = (props: Record<any, any>) => {
  const {message} = props;
  return (
    <Stack
      direction={'row'}
      spacing={0.5}
      sx={{
        justifyContent: 'flex-end'
      }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: ' white',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          whiteSpace: 'pre-wrap',
          maxWidth: '100%',
        }}
      >
        {message.text}
      </Box>
      <Avatar/>
    </Stack>
  )
}
export default MeMessage