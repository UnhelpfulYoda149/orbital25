import { Card, Grid, Button, IconButton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

interface FriendRequestCardProps {
  username: string;
  handleAccept: (name: string) => void;
  handleReject: (name: string) => void;
}

function FriendRequestCard({
  username,
  handleAccept,
  handleReject,
}: FriendRequestCardProps) {
  return (
    <Card variant="outlined" sx={{ minWidth: 500, position: "relative" }}>
      <CardContent>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5">{username}</Typography>
          <div style={{ position: "absolute", right: 20 }}>
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1">Accept?</Typography>
              <IconButton onClick={() => handleAccept(username)}>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={() => handleReject(username)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FriendRequestCard;
