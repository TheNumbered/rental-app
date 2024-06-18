import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from ".";
import { useGlobal } from "./global-provider";

export const useCreateMutation = ({
  resource,
  invalidateKeys,
}: {
  resource: string;
  invalidateKeys?: string[];
}) => {
  const { showToast } = useGlobal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: {data: Record<string, any>}) => {
      try {
        const res = await sql(
          `INSERT INTO ${resource} (${Object.keys(data).join(
            ", "
          )}) VALUES (${Object.values(data)
            .map((value) => `'${value}'`)
            .join(", ")})`
        );
        showToast("Record successfully inserted!", "success");
        return res;
      } catch (err) {
        showToast(`Error: ${(err as Error).message}`, "error");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });
};
