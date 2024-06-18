import { useDeleteMutation, useGetQuery, useUpdateMutation } from "@/hooks";
import { Houses, Rooms } from "@/interfaces";
import { useUser } from "@clerk/clerk-react";
import { Close, DeleteForeverRounded, SaveRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

type EditRoomsModalProps = {
  open: boolean;
  onClose: () => void;
};

const EditRoomsModal: React.FC<EditRoomsModalProps> = ({ open, onClose }) => {
  const {user} = useUser();
  const { data: roomsData } = useGetQuery<Rooms[]>({ resource: "rooms" });
  const { data: housesData } = useGetQuery<Houses[]>({ resource: "houses", appendToSql: `WHERE user_id = '${user?.id}'`});
  const { mutate: deleteRoom } = useDeleteMutation({ resource: "rooms" });
  const {mutate: updateRoom} = useUpdateMutation({resource: "rooms", invalidateKeys: ["tenants", "available-rooms"]});

  const rooms = roomsData ?? [];
  const houses = housesData ?? [];

  const [selectedHouse, setSelectedHouse] = useState<string>("");
  const [filteredRooms, setFilteredRooms] = useState<Rooms[]>([]);

  useEffect(() => {
    if (selectedHouse) {
      setFilteredRooms(rooms.filter((room) => room.house_id === selectedHouse));
    } else {
      setFilteredRooms([]);
    }
  }, [selectedHouse, rooms]);

  const handleChange = (e: any, roomId: string) => {
    const { name, value } = e.target;

    setFilteredRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, [name]: name === "rent_amount" ? Number(value) : value } : room
      )
    );
  };

  const handleSaveRoom = (roomId: string) => {
    const updatedRoom = filteredRooms.find((room) => room.id === roomId);
    if (updatedRoom) {
      updateRoom({ id: roomId, data: updatedRoom })
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteRoom({ id: roomId });
    setFilteredRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 300,
          width: "100%",
          maxWidth: 600,
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="h2">
            Edit Rooms
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Select
          fullWidth
          variant="outlined"
          value={selectedHouse}
          onChange={(e) => setSelectedHouse(e.target.value as string)}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>Select House</em>
          </MenuItem>
          {houses.map((house) => (
            <MenuItem key={house.id} value={house.id}>
              {house.address}
            </MenuItem>
          ))}
        </Select>
        {filteredRooms.map((room) => (
          <Box key={room.id} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <TextField
              label="Room Number"
              name="room_number"
              value={room.room_number}
              onChange={(e) => handleChange(e, room.id)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Rent Amount"
              name="rent_amount"
              type="number"
              value={room.rent_amount}
              onChange={(e) => handleChange(e, room.id)}
              sx={{ flex: 1 }}
            />
            <IconButton color="secondary" onClick={() => handleDeleteRoom(room.id)}>
              <DeleteForeverRounded/>
            </IconButton>
            <IconButton color="primary" onClick={() => handleSaveRoom(room.id)}>
              <SaveRounded/>
            </IconButton>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditRoomsModal;
