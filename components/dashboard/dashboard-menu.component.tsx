import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/router"; // Import the useRouter hook
import { colors } from "@/styles/defaultTheme";

export const DashboardMenu = () => {
  const router = useRouter(); // Get the current route

  return (
    <Box
      cursor="pointer"
      display="flex"
      justifyContent="space-between"
    >
      <Button
        bg={colors.brand.primary}
        color={router.pathname === "/" ? colors.brand.quaternary : colors.brand.secondary}
        borderRadius="0.5rem"
        p="0.25rem"
        fontSize="18px"
        fontWeight={600}
        letterSpacing="3px"
        h="6rem"
        flex="1" 
        mr="1rem"
        onClick={() => router.push("/")}
      >
        PERSONAL
      </Button>
      <Button
        bg={colors.brand.primary}
        color={router.pathname === "/faction" ? colors.brand.quaternary : colors.brand.secondary}        borderRadius="0.5rem"
        p="0.25rem"
        fontSize="18px"
        fontWeight={600}
        letterSpacing="3px"
        h="6rem"
        flex="1"
        ml="1rem"
        onClick={() => router.push("/faction")}
      >
        FACTION
      </Button>
    </Box>
  );
};
