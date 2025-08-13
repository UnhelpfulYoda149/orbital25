import {
  Card,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import ProfileCard from "./ProfileCard";
import { useState } from "react";

interface UserCardProps {
  username: string;
  requested: boolean;
  handleClick: (name: string) => void;
}

function UserCard({ username, requested, handleClick }: UserCardProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

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
              <>
                <Button onClick={() => setOpen(true)}>Cancel Request</Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                >
                  <DialogTitle id="alert-dialog-title">
                    Cancel Friend Request?
                  </DialogTitle>
                  <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleClose();
                        handleClick(username);
                      }}
                      autoFocus
                      variant="contained"
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default UserCard;
