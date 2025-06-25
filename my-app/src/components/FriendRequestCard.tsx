import { Card, Grid, Button, IconButton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";

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
  
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ minWidth: 500, position: "relative" }}>
      <CardContent>
        <Grid container direction="row" alignItems="center" spacing={1}>
          {username && (
            <Avatar
              sx={{ cursor: "pointer", bgcolor: "primary.main" }}
              onClick={() => navigate(`/profile/${username}`)}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          )}
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
