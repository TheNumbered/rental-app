import { useCreateMutation, useGetQuery, useSqlQuery } from "@/hooks";
import { Houses, Rooms, TenantsInput } from "@/interfaces";
import { useUser } from "@clerk/clerk-react";
import { Close } from "@mui/icons-material";
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
import { AvailableRoomsQuery } from "./querys";

type AddTenantModalProps = {
  open: boolean;
  onClose: () => void;
};

const CreateTenantModal: React.FC<AddTenantModalProps> = ({
  open,
  onClose,
}) => {
  const { user } = useUser();
  const { data: rooms } = useSqlQuery<Rooms[]>({
    query: AvailableRoomsQuery(user?.id || ""),
    queryKey: "available-rooms",
  });
  const { data: houses } = useGetQuery<Houses[]>({ resource: "houses", appendToSql: `WHERE user_id = '${user?.id}'`});
  const { mutate: createTenant } = useCreateMutation({
    resource: "tenants",
    invalidateKeys: ["tenants", "available-rooms"],
  });

  const [tenant, setTenant] = useState<TenantsInput>({
    name: "",
    contact_number: "",
    entered_date: new Date(),
    room_id: "",
  });
  const [selectedHouse, setSelectedHouse] = useState<string>("");
  const [filteredRooms, setFilteredRooms] = useState<Rooms[]>([]);

  useEffect(() => {
    if (selectedHouse) {
      setFilteredRooms(
        rooms?.filter((room) => room.house_id === selectedHouse) || []
      );
    } else {
      setFilteredRooms([]);
    }
  }, [selectedHouse, rooms]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    createTenant({
      data: {
        ...tenant,
        entered_date: new Date(tenant.entered_date ?? "")
          .toISOString()
          .split("T")[0],
      },
    });

    setTenant({
      name: "",
      contact_number: "",
      entered_date: new Date(),
      room_id: "",
    });
    setSelectedHouse("");
    onClose();
  };

  const isSaveDisabled =
    !tenant.name || !tenant.entered_date || !tenant.room_id;

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
            Add New Tenant
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          label="Name"
          name="name"
          value={tenant.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Contact Number"
          name="contact_number"
          value={tenant.contact_number}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Entered Date"
          name="entered_date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={
            new Date(tenant.entered_date ?? "").toISOString().split("T")[0]
          }
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
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
          {houses?.map((house) => (
            <MenuItem key={house.id} value={house.id}>
              {house.address}
            </MenuItem>
          ))}
        </Select>
        <Select
          fullWidth
          variant="outlined"
          value={tenant.room_id || ""}
          onChange={handleChange}
          displayEmpty
          name="room_id"
          disabled={!selectedHouse}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">
            <em>Select Room</em>
          </MenuItem>
          {filteredRooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.room_number}
            </MenuItem>
          ))}
        </Select>
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

export default CreateTenantModal;
