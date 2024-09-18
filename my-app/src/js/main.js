// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

//Import supabase
import { createClient } from '@supabase/supabase-js'

//import router function
import { setRouter } from './router/router.js';
//  setRouter
   setRouter();

// Create a single supabase client for interacting with your database
const supabase = createClient('https://znurbodoeuuhqkgdxvql.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudXJib2RvZXV1aHFrZ2R4dnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyMjM2NTYsImV4cCI6MjAyODc5OTY1Nn0.7Kk9i6k-qRvhMqgOhH4ZI01afzwg4nbj1boFr_k6xO0')

//export { supabase };

//notifications
function successNotification(message, seconds = 0) {
    document.querySelector(".alert-success").classList.remove("d-none");
    document.querySelector(".alert-success").classList.add("d-block");
    document.querySelector(".alert-success").innerHTML = message;

    if(seconds != 0){
        setTimeout(function () {
            document.querySelector(".alert-success").classList.remove("d-block");
            document.querySelector(".alert-success").classList.add("d-none");
        }, seconds * 1000);
    }
}

function errorNotification(message, seconds = 0) {
    document.querySelector(".alert-danger").classList.remove("d-none");
    document.querySelector(".alert-danger").classList.add("d-block");
    document.querySelector(".alert-danger").innerHTML = message;

    if(seconds != 0){
        setTimeout(function () {
            document.querySelector(".alert-danger").classList.remove("d-block");
            document.querySelector(".alert-danger").classList.add("d-none");
        }, seconds * 1000);
    }
}

//logout function
async function doLogout(){
    // supabase logout
    let { error } = await supabase.auth.signOut();

    if(error == null) {
        successNotification("successfully logged out",3);
       // clear local data
    localStorage.clear();
    // redirect to login page
    window.location.pathname = "./login.html";
    }else{
        errorNotification("error logging out",3);
    }
}


export { supabase, successNotification, errorNotification, doLogout };