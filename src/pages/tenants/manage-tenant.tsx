import { useSqlQuery } from "@/hooks";
import { TextField, Typography } from "@mui/material";
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

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading tenants</Typography>;

    const filteredTenants = data?.filter((tenant) => {
        return tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    });


    return (
        <>
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
                width: "100%",
                mb: 2,
                
            }}
        />
        {filteredTenants?.[0] ? (
            <TenantCard tenant={filteredTenants[0]} />
        ) : (
            <Typography>No tenants found</Typography>
        )}
        </>
    );
}