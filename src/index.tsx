import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { extendTheme } from "@chakra-ui/react";
import App from "./App";
import "./index.css";

export const theme = extendTheme(
  {
    colors: {
      purple: {
        "50": "#f6f9fb",
        "100": "#e2f0fc",
        "200": "#bbdaff",
        "300": "#89b7ff",
        "400": "#6486ff",
        "500": "#6486ff",
        "600": "#424ce1",
        "700": "#383ab9",
        "800": "#26288a",
        "900": "#0c185f"
      }
    }
  },
  {
    initialColorMode: "system"
  }
);

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
