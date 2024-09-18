import { supabase, successNotification, errorNotification, doLogout } from "../main";

const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = doLogout;