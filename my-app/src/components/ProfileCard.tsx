import { Avatar, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  username: string;
  bgcolor: string;
}

function ProfileCard({ username, bgcolor }: ProfileCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ backgroundColor: bgcolor }} variant="outlined">
      <CardActionArea onClick={() => navigate(`/profile/${username}`)}>
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={0.5}
          padding={0.3}
        >
          <Avatar sx={{ cursor: "pointer", bgcolor: "primary.main" }}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="caption">{username}</Typography>
        </Grid>
      </CardActionArea>
    </Card>
  );
}

export default ProfileCard;
