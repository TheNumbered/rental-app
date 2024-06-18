import { useCreateMutation, useGetQuery } from "@/hooks";
import { Houses, RoomsInput } from "@/interfaces";
import { useUser } from "@clerk/clerk-react";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

type CreateRoomModalProps = {
  open: boolean;
  onClose: () => void;
};

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ open, onClose }) => {
  const { user } = useUser();
  const { data: houses } = useGetQuery<Houses[]>({ resource: "houses", appendToSql: `WHERE user_id = '${user?.id}'`});
  const { mutate: createRoom } = useCreateMutation({ resource: "rooms", invalidateKeys: ["available-rooms"]});


  const [room, setRoom] = useState<RoomsInput>({
    house_id: "",
    room_number: "",
    rent_amount: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setRoom((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSave = () => {
    createRoom({ data: room });
    setRoom({
      house_id: "",
      room_number: "",
      rent_amount: 0,
    });
    onClose();
  };

  const isSaveDisabled = !room.house_id || !room.room_number || (room.rent_amount || 0) <= 0;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="h2">
            Add New Room
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Select
          fullWidth
          variant="outlined"
          name="house_id"
          value={room.house_id}
          onChange={handleChange}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>Select House</em>
          </MenuItem>
          {houses?.map((house) => (
            <MenuItem key={house.id} value={house.id}>
              {house.address}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          variant="outlined"
          label="Room Number"
          name="room_number"
          value={room.room_number}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Rent Amount"
          name="rent_amount"
          type="number"
          value={room.rent_amount}
          InputProps={{
            startAdornment: (<InputAdornment position="start">R</InputAdornment>),
          }}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateRoomModal;
