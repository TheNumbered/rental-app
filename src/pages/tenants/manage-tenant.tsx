import { useSqlQuery } from "@/hooks";
import { TextField, Typography, Box, CircularProgress, Card, CardHeader } from "@mui/material";
import { Tenant, TenantQueryString } from "./querys";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { TenantCard } from "./card";

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
        <Card
        style={{
            backgroundColor: "#cbe8e2"
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
          </Card>
    );
}
