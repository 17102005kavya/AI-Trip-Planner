import {createContext, useContext} from "react";
import { useUser } from "@clerk/nextjs";    

export const UserDetailContext=createContext<any>(null);