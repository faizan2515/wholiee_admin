import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmationDialog = ({ open, setOpen, handleDelete }) => {
  return (
    <Dialog open={open.isOpen}>
      <DialogTitle>Are you sure you want to delete this?</DialogTitle>
      <DialogContent>
        <DialogContentText>This change can not be reverted</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDelete(open.id)}>Yes</Button>
        <Button
          onClick={() => {
            setOpen({ isOpen: false, id: null });
          }}
          autoFocus
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
