import { supabase, successNotification, errorNotification } from "../main";

let userId; // Declare userId in the global scope
let userData; // Declare userData outside the event listener

document.addEventListener('DOMContentLoaded', async function () {
    // Retrieve user_id from localStorage
    userId = localStorage.getItem("user_id");

    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    // Fetch user data from Supabase based on the user_id
    const { data: fetchedUserData, error: userError } = await supabase
        .from('user_information')
        .select('first_name, last_name, profile_pic, bg_pic')
        .eq('user_id', userId)
        .single();

    if (userError) {
        console.error('Error fetching user data:', userError.message);
        return;
    }

    if (!fetchedUserData) {
        console.error('No user data found');
        return;
    }

    userData = fetchedUserData; // Assign fetched user data to userData

    // Populate form fields with user data (Note: File inputs cannot be set programmatically for security reasons)
    document.getElementById('first_name').value = userData.first_name;
    document.getElementById('last_name').value = userData.last_name;
    // Don't set file input values - browsers prevent this for security
});

// Event listener for form submission
const form = document.getElementById('form_edit');
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Disable the submit button and show loading spinner
    const submitButton = document.querySelector("#form_edit button[type='submit']");
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="spinner-border me-2" role="status"></div><span>Loading...</span>';

    // Get updated user information from form
    const formData = new FormData(form);
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const profileImageFile = formData.get("profile_pic");
    const backgroundImageFile = formData.get("background_pic");

    let profileImagePath = userData.profile_pic;
    let backgroundImagePath = userData.bg_pic;

    // Helper function to sanitize filename
    const sanitizeFilename = (filename) => {
        const timestamp = Date.now();
        const extension = filename.substring(filename.lastIndexOf('.'));
        const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
        // Remove special characters, spaces, and replace with underscores
        const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
        return `${sanitized}_${timestamp}${extension}`;
    };

    // Upload the new profile image if a file is selected
    if (profileImageFile && profileImageFile.name) {
        try {
            const sanitizedFilename = sanitizeFilename(profileImageFile.name);
            const { data: imageData, error: imageError } = await supabase
                .storage
                .from("users_image")
                .upload(`public/${sanitizedFilename}`, profileImageFile, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (imageError) {
                throw imageError;
            }

            profileImagePath = imageData.path;

        } catch (error) {
            console.error('Error uploading profile image:', error.message);
            errorNotification("Something went wrong while uploading the profile image: " + error.message, 5);
            submitButton.disabled = false;
            submitButton.innerHTML = 'Save Changes';
            return;
        }
    }

    // Upload the new background image if a file is selected
    if (backgroundImageFile && backgroundImageFile.name) {
        try {
            const sanitizedFilename = sanitizeFilename(backgroundImageFile.name);
            const { data: imageData, error: imageError } = await supabase
                .storage
                .from("images")
                .upload(`public/${sanitizedFilename}`, backgroundImageFile, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (imageError) {
                throw imageError;
            }

            backgroundImagePath = imageData.path;

        } catch (error) {
            console.error('Error uploading background image:', error.message);
            errorNotification("Something went wrong while uploading the background image", 5);
            submitButton.disabled = false;
            submitButton.innerHTML = 'Save Changes';
            return;
        }
    }

    const updatedData = {
        first_name: firstName,
        last_name: lastName,
        profile_pic: profileImagePath,
        bg_pic: backgroundImagePath,
    };

    // Update user information in Supabase based on the user_id
    const { error: updateError } = await supabase
        .from('user_information')
        .update(updatedData)
        .eq('user_id', userId);

    if (updateError) {
        console.error('Error updating user data:', updateError.message);
        errorNotification("Failed to update profile", 5);
        submitButton.disabled = false;
        submitButton.innerHTML = 'Save Changes';
        return;
    }

    // Notify user about successful update
    successNotification("Profile updated successfully", 5);

    // Reset the form
    form.reset();

    // Enable the submit button and reset its text
    submitButton.disabled = false;
    submitButton.innerHTML = 'Save Changes';

    // Optional: Reload the page or redirect to the profile page
    window.location.href = 'profile.html';

});

