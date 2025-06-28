import { Card, Grid, Button } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ProfileCard from "./ProfileCard";

interface UserCardProps {
  username: string;
  requested: boolean;
  handleClick: (name: string) => void;
}

function UserCard({ username, requested, handleClick }: UserCardProps) {
  return (
    <Card variant="outlined" sx={{ minWidth: 500, position: "relative" }}>
      <CardContent>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <ProfileCard username={username} bgcolor="#eeeeee" />
          <div style={{ position: "absolute", right: 50 }}>
            {!requested ? (
              <Button variant="contained" onClick={() => handleClick(username)}>
                Send Request
              </Button>
            ) : (
              <Button onClick={() => handleClick(username)}>
                Cancel Request
              </Button>
            )}
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default UserCard;
