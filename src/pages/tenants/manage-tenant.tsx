import { useSqlQuery } from "@/hooks";
import { TextField, Typography, Box, CircularProgress } from "@mui/material";
import { Tenant, TenantQueryString } from "./querys";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { TenantCard } from "./card";
import { CenteredLayout } from "@/components";

export const ManageTenant: React.FC = () => {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isLoading, isError } = useSqlQuery<Tenant[]>({
        query: TenantQueryString(user?.id || ""),
        queryKey: "tenants",
    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredTenants = data?.filter((tenant) => {
        return tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <CenteredLayout>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    padding: 1,
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "background.paper",
                    width: "100%",
                    maxWidth: "600px",
                    margin: "auto"
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: 1,
                        mb: 2,
                        width: "100%",
                    }}
                />
                {isLoading && <CircularProgress />}
                {isError && <Typography>Error loading tenants</Typography>}
                {!isLoading && !isError && (
                    filteredTenants?.length ? (
                        <TenantCard tenant={filteredTenants[0]} />
                    ) : (
                        <Typography>No tenants found</Typography>
                    )
                )}
            </Box>
        </CenteredLayout>
    );
}
