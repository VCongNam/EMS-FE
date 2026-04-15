import * as signalR from "@microsoft/signalr";
import { getApiUrl } from '../config/api';
import useAuthStore from "@/store/authStore";

//Local test
//const HUB_URL = "https://localhost:7049/notificationHub";

//Server test
const HUB_URL = getApiUrl('/notificationHub'); 

const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
        accessTokenFactory: () => {
            const token = useAuthStore.getState().user?.token;
            console.log("SignalR sending token:", token); 
            return token;
        },
        skipNegotiation: false, 
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling 
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) // Cố gắng kết nối lại sau 0s, 2s, 5s...
    .build();

export default connection;