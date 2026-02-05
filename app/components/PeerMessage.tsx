import {Avatar, Box, Chip, Stack, Typography} from "@mui/material";
import {FlutterDash} from "@mui/icons-material";


const PeerMessage = (props: Record<string, any>) => {
  const {message} = props;
  return (
    <Stack
      direction={'row'}
      spacing={0.5}
      sx={{
        justifyContent: 'flex-start'
      }}>
      <Avatar><FlutterDash/></Avatar>
      <Box
        sx={{
          bgcolor: 'grey.300',
          color: 'black',
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
    </Stack>
  )
}
export default PeerMessage