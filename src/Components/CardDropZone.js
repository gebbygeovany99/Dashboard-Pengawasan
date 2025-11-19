import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import InputFileUpload from './InputFileUpload';
import { Box, Button } from '@mui/material';



export default function BasicCard() {
  return (
    <Card sx={{ 
      minWidth: 275, 
      mt: 5, 
      borderRadius: '30px', 
      height: "80vh",
      alignContent: 'center'
      }}
    >
      <CardContent>
          <InsertDriveFileOutlinedIcon sx={{
            fontSize:'100px', 
            
            }}
          />
          <Box>
            <InputFileUpload text={"Unggah File"} />
          </Box>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  );
}