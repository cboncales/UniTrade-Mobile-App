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
const supabase = createClient('https://cipijlbikazyqbmuknek.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpcGlqbGJpa2F6eXFibXVrbmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNjU1MDgsImV4cCI6MjA3Njk0MTUwOH0.XzU1sMOiBUNcRY17W5jG8S1bYAaDi4-995mOBq-eOIk')

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