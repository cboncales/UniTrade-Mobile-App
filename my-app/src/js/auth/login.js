import { supabase, successNotification, errorNotification } from "../main";
const form_login = document.getElementById("form_login");

/*form_login.onsubmit = async (e) => {
    e.preventDefault();

       //disable the button
       document.querySelector("#form_login button").disabled = true;
       document.querySelector("#form_login button").innerHTML = '<div class="spinner-border me-2" role="status"></div><span>Loading...</span>';
    
    //get all values in login form
    const formData = new FormData(form_login);

    //supabase login
let { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  let session = data.session;
  let user = data.user;

    console.log(session);
    // if user can be acccess, means user is aready verified
   if(session != null) {
    // store tokens for API
     localStorage.setItem("access_token", session.access_token);
     localStorage.setItem("refresh_token", session.refresh_token);

     // Store user ID in localStorage
    localStorage.setItem("user_id", user.id); // Assuming user.id contains the user's ID
   }


    // show notification
  if(error == null){
    successNotification("Login Successfully!! ",5);
      //redirect to homepage
      window.location.href = '/home.html';
    console.log(data);
    }else{
        errorNotification("Invalid Email or Password",5);
        console.log(error);
    }

    // form_login reset
    form_login.reset();

         //enable submit button
         document.querySelector("#form_login button").disabled = false;
         document.querySelector("#form_login button").innerHTML = "Login";

       
};  */



/*
import { supabase, successNotification, errorNotification } from "../main";

const form_login = document.getElementById("form_login");

form_login.onsubmit = async (e) => {
    e.preventDefault();

    // Disable the button and show loading indicator
    const loginButton = document.querySelector("#form_login button");
    loginButton.disabled = true;
    loginButton.innerHTML = '<div class="spinner-border me-2" role="status"></div><span>Loading...</span>';

    try {
        // Get form data
        const formData = new FormData(form_login);

        // Supabase login
        let { data, error } = await supabase.auth.signInWithPassword({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        // Check for errors
        if (error) {
            throw new Error(error.message || "An error occurred during login.");
        }

        // Extract session and user data
        const session = data.session;
        const user = data.user;

        // Check if session and user are available
        if (session && user && user.id) {
            // Store tokens and user ID in localStorage
            localStorage.setItem("access_token", session.access_token);
            localStorage.setItem("refresh_token", session.refresh_token);
            localStorage.setItem("user_id", user.id);

            // Fetch user data and handle further actions
            await fetchUserData();

            // Show success notification and redirect to homepage
            successNotification("Login Successful!", 5);
            window.location.href = '/home.html';
        } else {
            throw new Error("User ID not found in login response.");
        }
    } catch (error) {
        // Log and display error message
        console.error("Login Error:", error);
        errorNotification("An error occurred during login. Please try again.", 5);
    } finally {
        // Reset the form and enable the submit button
        form_login.reset();
        loginButton.disabled = false;
        loginButton.innerHTML = "Login";
    }
}; */




form_login.onsubmit = async (e) => {
    e.preventDefault();

    // Disable the button
    document.querySelector("#form_login button").disabled = true;
    document.querySelector("#form_login button").innerHTML = '<div class="spinner-border me-2" role="status"></div><span>Loading...</span>';

    // Get all values in the login form
    const formData = new FormData(form_login);

    // Supabase login
    let { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (error) {
        // Handle the error appropriately
        console.error("Login error:", error);
        errorNotification("Invalid Email or Password", 5);
        document.querySelector("#form_login button").disabled = false;
        document.querySelector("#form_login button").innerHTML = "Login";
        return;
    }

    let session = data.session;
    let user = data.user;

    console.log("Session:", session);
    console.log("User:", user);

    if (session) {
        // Store tokens for API
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);

        // Store user ID in localStorage
        localStorage.setItem("user_id", user.id); // Assuming user.id contains the user's ID

        // Log the user ID to the console
        console.log("User ID stored in localStorage:", user.id);

        // Show success notification
        successNotification("Login Successfully!!", 5);

        // Redirect to homepage
        window.location.href = '/home.html';
    }

    // Reset the form
    form_login.reset();

    // Enable the submit button
    document.querySelector("#form_login button").disabled = false;
    document.querySelector("#form_login button").innerHTML = "Login";
};


/*
import { supabase, successNotification, errorNotification } from "../main";
const form_login = document.getElementById("form_login");

form_login.onsubmit = async (e) => {
    e.preventDefault();

       //disable the button
       document.querySelector("#form_login button").disabled = true;
       document.querySelector("#form_login button").innerHTML = '<div class="spinner-border me-2" role="status"></div><span>Loading...</span>';
    
    //get all values in login form
    const formData = new FormData(form_login);

    //supabase login
let { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  let session = data.session;
  let user = data.user;

    console.log(session);
    // if user can be acccess, means user is aready verified
   if(session != null) {
    // store tokens for API
     localStorage.setItem("access_token", session.access_token);
     localStorage.setItem("refresh_token", session.refresh_token);

     // for role authentication

   }


    // show notification
  if(error == null){
    successNotification("Login Successfully!! ",5);
      //redirect to homepage
      window.location.href = '/home.html';
    console.log(data);
    }else{
        errorNotification("Invalid Email or Password",5);
        console.log(error);
    }

    // form_login reset
    form_login.reset();

         //enable submit button
         document.querySelector("#form_login button").disabled = false;
         document.querySelector("#form_login button").innerHTML = "Login";

       
};
*/