import { useCreateMutation, useGetQuery, useSqlQuery } from "@/hooks";
import { Houses } from "@/interfaces";
import { useUser } from "@clerk/clerk-react";
import { AddHomeWorkRounded, Chalet, GroupAddRounded, Settings } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Popover,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { TenantCard } from "./card";
import CreateRoomModal from "./create-room";
import CreateTenantModal from "./create-tenant";
import EditRoomsModal from "./edit-rooms";
import { Tenant, TenantQueryString } from "./querys";

const TenantList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [houseFilter, setHouseFilter] = useState("");
  const [addHouse, setAddHouse] = useState("");
  const [isCreateTenantModalOpen, setIsCreateTenantModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isEditRoomsModalOpen, setIsEditRoomsModalOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { user } = useUser();
  const { data, isLoading, isError } = useSqlQuery<Tenant[]>({
    query: TenantQueryString(user?.id || ""),
    queryKey: "tenants",
  });
  const { data: houses } = useGetQuery<Houses[]>({ resource: "houses" , appendToSql: `WHERE user_id = '${user?.id}'`});
  const { mutate: createHouse, isPending: addHousePending } = useCreateMutation(
    { resource: "houses" }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleHouseFilterChange = (event: any) => {
    setHouseFilter(event.target.value as string);
  };

  const handleAddHouseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddHouse(event.target.value);
  };

  const handleAddHouseClick = () => {
    createHouse({
      data: {
        address: addHouse,
        user_id: user?.id || "",
      },
    });
    setAddHouse("");
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handleClosePopover = () => {
    setPopoverAnchor(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const filteredTenants = data?.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (houseFilter === "" || tenant.house_id === houseFilter)
  );

  const displayedTenants = filteredTenants?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container>
      <Box
        mt={4}
        mb={1}
        p={4}
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 3,
            fontStyle: "italic",
          }}
        >
          TENANT MANAGEMENT
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            backgroundColor: "primary.light",
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            flexWrap: "wrap",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 1,
              minWidth: "200px",
            }}
          />
          <Select
            value={houseFilter}
            onChange={handleHouseFilterChange}
            displayEmpty
            variant="outlined"
            sx={{
              flex: 0.5,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <MenuItem value="">
              <em>All Houses</em>
            </MenuItem>
            {houses?.map((house) => (
              <MenuItem key={house.id} value={house.id}>
                {house.address}
              </MenuItem>
            ))}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="New House"
                value={addHouse}
                onChange={handleAddHouseChange}
                sx={{
                  borderRadius: 2,
                  p: 2,
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color="primary"
                      onClick={handleAddHouseClick}
                      disabled={addHousePending}
                    >
                      <AddHomeWorkRounded />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Select>
          <IconButton
            color="primary"
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 1,
              ml: 1,
            }}
            onClick={handleSettingsClick}
          >
            <Settings />
          </IconButton>
          <Popover
            open={Boolean(popoverAnchor)}
            anchorEl={popoverAnchor}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
              <IconButton
                color="primary"
                onClick={() => {
                  setIsCreateTenantModalOpen(true);
                  handleClosePopover();
                }}
                sx={{ mb: 1 }}
              >
                <GroupAddRounded />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => {
                  setIsCreateRoomModalOpen(true);
                  handleClosePopover();
                }}
              >
                <AddHomeWorkRounded />
              </IconButton>
              
              <IconButton
                color="primary"
                onClick={() => {
                  setIsEditRoomsModalOpen(true);
                  handleClosePopover();
                }}
              >
                <Chalet />
              </IconButton>

            </Box>
          </Popover>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {displayedTenants?.map((tenant) => (
          <Grid item key={tenant.id} xs={12} md={6} lg={4}>
            <TenantCard tenant={tenant} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          variant={"outlined"}
          count={Math.ceil((filteredTenants?.length || 0) / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <CreateTenantModal
        open={isCreateTenantModalOpen}
        onClose={() => setIsCreateTenantModalOpen(false)}
      />
      <CreateRoomModal
        open={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
      />
      <EditRoomsModal
        open={isEditRoomsModalOpen}
        onClose={() => setIsEditRoomsModalOpen(false)}
      />
    </Container>
  );
};

export default TenantList;
