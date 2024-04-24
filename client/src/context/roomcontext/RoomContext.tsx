import { ReactNode, createContext } from "react";
import  SocketIOClient from 'socket.io-client'

export const RoomContext = createContext<null | any>(null)

interface RoomProviderProps {
    children: ReactNode; 
}

export const RoomProvider = ({children}: RoomProviderProps) => {
    const webSocketServer = 'http://localhost:8080'; 
    const contextValues = {
        
    }
    return (
        <RoomContext.Provider value={contextValues}>
            {children}
        </RoomContext.Provider>
    )
}