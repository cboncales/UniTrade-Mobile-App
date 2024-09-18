import { supabase, successNotification, errorNotification } from "../main";

const form_signup = document.getElementById("form_signup");

form_signup.onsubmit = async (e) => {
    e.preventDefault();

    //disable the button
    document.querySelector("#form_signup button").disabled = true;
    document.querySelector("#form_signup button").innerHTML = '<div class="spinner-border me-2" role="status"></div><span>Loading...</span>';


    //get all values from the form
   const formData = new FormData(form_signup);

    if( formData.get("password") == formData.get("password_confirmation")){
        //execute, if the condition is true
        //alert("password match");  
        // supabase signup the user
        const { data, error } = await supabase.auth.signUp({
            email: formData.get("email"),
            password: formData.get("password"),
        });

            //store into variable the user_id
       let user_id = data.user.id;  // get the id of the user

       //check if the user_id exists or registered 
       if(user_id != null){
        const { data, error } = await supabase
        .from('user_information')
        .insert([
            { 
                first_name: formData.get("first_name"),
                last_name: formData.get("last_name"),
                phone_number: formData.get("phone_number"),
                social_link: formData.get("social_link"),
                user_id: user_id,
            },
        ])
        .select();
        
        //provide notification message
        if(error == null){
        successNotification("Register Successfully!! <a href='./login.html' class='fw-bolder'>Click here to Log-in</a>", 3);
        console.log(data);
        }else{
        
            errorNotification("Error occured, User not register", 3);
            console.log(error);
        }
         // reset form_register
         form_signup.reset();

         //enable submit button
         document.querySelector("#form_signup button").disabled = false;
         document.querySelector("#form_signup button").innerHTML = "Register";
     
    }
  }else{
    //alert("Password does not match");
    errorNotification("Password does not match!", 3);
    console.log(error);
    
  }
    //alert("sucessfully registered");
   
}; 