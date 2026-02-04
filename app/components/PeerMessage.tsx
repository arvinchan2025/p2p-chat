import {Avatar, Box, Stack} from "@mui/material";
import {FlutterDash} from "@mui/icons-material";


const PeerMessage = (props: Record<string, any>) => {
  const {message} = props;
  return (
    <Stack
      direction={'row'}
      spacing={0.5}
      sx={{
        justifyContent: 'flex-end'
      }}>
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
      <Avatar><FlutterDash/></Avatar>
    </Stack>
  )
}
export default PeerMessage