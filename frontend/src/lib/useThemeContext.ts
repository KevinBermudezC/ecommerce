import { createContext } from "react";
import {ThemeContextType} from "../context/ThemeContext"

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);