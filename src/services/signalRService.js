import * as signalR from "@microsoft/signalr";
import { getApiUrl } from '../config/api';
import useAuthStore from "@/store/authStore";

//Local test
const HUB_URL = "https://localhost:7049/notificationHub";

//Server test
//const HUB_URL = (getApiUrl)('/notificationHub');

const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL,{
        accessTokenFactory: () => {
            // 1. Lấy chuỗi JSON từ localStorage
            const token = useAuthStore.getState().user?.token;
            
            console.log("SignalR sending token:", token); 
            return token;
        }
    })
    .withAutomaticReconnect()
    .build();
export default connection;