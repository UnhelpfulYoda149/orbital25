import { Avatar, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileCard.css";

interface ProfileCardProps {
  username: string;
  bgcolor: string;
}

function ProfileCard({ username, bgcolor }: ProfileCardProps) {
  const navigate = useNavigate();

  return (
    // <Card sx={{ backgroundColor: bgcolor }} variant="outlined">
    <div
      className="profile-link"
      onClick={() => navigate(`/profile/${username}`)}
      style={{ "--bgcolor": bgcolor } as React.CSSProperties}
    >
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
    </div>
    // </Card>
  );
}

export default ProfileCard;
