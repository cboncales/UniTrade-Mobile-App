import { supabase, successNotification, errorNotification, doLogout } from "../main";

// Get Image URL
const ProductImageUrl = "https://znurbodoeuuhqkgdxvql.supabase.co/storage/v1/object/public/images/";
const profile_img_url ="https://znurbodoeuuhqkgdxvql.supabase.co/storage/v1/object/public/users_image/";


const btn_logout = document.getElementById("btn_logout");
// Assign logout functionality
btn_logout.onclick = doLogout;

document.addEventListener("DOMContentLoaded", async function() {    
    try {
        // Fetch session data
        const { data: { user } } = await supabase.auth.getUser();
            
        // Store user ID in local storage
        localStorage.setItem("user_id", user.id);

        // Fetch user data from Supabase based on the user_id
        let { data: userData, error: userDataError } = await supabase
            .from('user_information')
            .select('id, first_name, last_name, profile_pic')
            .eq('user_id', user.id)
            .single();
                
        if (userDataError) {
            throw userDataError;
        }

        // Check if profile_pic is null
        if (!userData.profile_pic) {
            // If profile_pic is null, set it to public/blank.png
            userData.profile_pic = 'public/blank.png';

            // Update the user information in Supabase
            const { error: updateError } = await supabase
                .from('user_information')
                .update({ profile_pic: 'public/blank.png' })
                .eq('user_id', user.id);

            if (updateError) {
                throw updateError;
            }
        }

        // Store user data in local storage
        localStorage.setItem("user_data", JSON.stringify(userData));

    } catch (error) {
        console.error('Error:', error);
    }
});

// Load Data
const urlParams = new URLSearchParams(window.location.search);
const searchKeyword = urlParams.get('keyword') || "";
getDatas(searchKeyword);

// Category event listeners
document.querySelectorAll('.category-items a').forEach(categoryLink => {
    categoryLink.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.closest('a').getAttribute('data-category');
        getDatas(searchKeyword, category);
    });
});

const post_product = document.getElementById("post_product");

post_product.onsubmit = async (e) => {
    e.preventDefault();

    // Disable Button
    document.querySelector("#post_product button[type='submit']").disabled = true;
    document.querySelector("#post_product button[type='submit']").innerHTML = `<span>Loading...</span>`;

    // Get all values from input, select, textarea under form tag
    const formData = new FormData(post_product);
    // Fetch user information
    const userId = localStorage.getItem("user_id");
    const { data: userInfo, error: userInfoError } = await supabase
        .from('user_information')
        .select('id, first_name, last_name, profile_pic')
        .eq('user_id', userId)
        .single();
            
    if (userInfoError) {
        throw userInfoError;
    }
            
    const user_info_id = userInfo.id;

    // Upload Product Image
    const image = formData.get("image_path");

    const { data, error } = await supabase
        .storage
        .from('images')
        .upload("public/" + image.name, image, {
            cacheControl: '3600',
            upsert: true,
        });

    const image_data = data;

    if (error) {
        errorNotification(
            "Something wrong happened. Cannot upload image, image size might be too big. You may update the product's image.",
            15
        );
        console.log(error);
    }

    if (for_update_id == "") {
        // Supabase Create
        const { data, error } = await supabase
            .from('product')
            .insert([
                {
                    product_name: formData.get("product_name"),
                    description: formData.get("description"),
                    price: formData.get("price"),
                    created_at: new Date().toISOString(), // Provide the current timestamp
                    image_path: image_data == null ? null : image_data.path,
                    category_id: formData.get("category_name"),
                    user_information_id: userInfo.id,
                },
            ])
            .select();

        if (error == null) {
            successNotification("Product successfully posted!", 3);

            // Reload Datas
            getDatas();
        } else {
            errorNotification("Somethings wrong, Product not posted!", 3);
            console.log(error);
        }
    } else { // for Update
        const { data, error } = await supabase
            .from('product')
            .update(
                {
                    product_name: formData.get("product_name"),
                    description: formData.get("description"),
                    price: formData.get("price"),
                    image_path: image_data == null ? null : image_data.path,
                    category_id: formData.get("category_name"),
                })
            .eq('product_id', for_update_id)
            .select();

        if (error == null) {
            successNotification("Post successfully Updated!", 3);

            // Reset storage id
            for_update_id = "";

            // Reload Datas
            getDatas();
        } else {
            errorNotification("Somethings wrong, Product not posted!", 3);
            console.log(error);

        }
    }

    // Close Modal
    document.getElementById("modal_close").click();

    // Reset Form
    post_product.reset();

    // Enable Button
    document.querySelector("#post_product button[type='submit']").disabled = false;
    document.querySelector("#post_product button[type='submit']").innerHTML = `Submit`;
};

// Load Data Functionality
async function getDatas(keyword = "", category = "") {
    // Build query with join
    let query = supabase
        .from('product')
        .select(`
            *,
            user_information (
                first_name,
                last_name,
                profile_pic
            )
        `)
        .or(
            `product_name.ilike.%${keyword}%, description.ilike.%${keyword}%`
        );

    if (category) {
        query = query.eq('category_id', category);
    }

    let { data: product, error } = await query;

    // Temporary storage for html elements and each items
    let container = "";
    // Get each product and interpolate with html elements
        product.forEach((product) => {
            container += `
            <div class="col-md-3 py-3 mt-3 py-md-0">
            <div class="card" data-id="${product.product_id}">
                <div class="card-head">
                <div class="profile-info ms-3">
                    <a href="stalk.html?user_id=${product.user_information.user_id}">
                        <img id="prof_pic" src="${profile_img_url + product.user_information.profile_pic}" alt="Profile Image">
                    </a>
                    <a href="stalk.html?user_id=${product.user_information.user_id}">
                        <span id="user_name">${product.user_information.first_name} ${product.user_information.last_name}</span>
                    </a>
                </div>
                <div class="dropdown mt-2 me-3">
                    <a class="btn btn-warning text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    </a>
                
                    <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" id="btn_edit" data-id="${product.product_id}">Edit</a></li>
                    <li><a class="dropdown-item" href="#" id="btn_delete" data-id="${product.product_id}">Delete</a></li>
                    </ul>
                </div>
                </div>
                <img id="photo" src="${ProductImageUrl + product.image_path}" alt="">
                <div class="card-body">
                <h3 class="text-center">${product.product_name}</h3>
                <p class="text-center">${product.description}</p>
                <div class="star text-center">
                    <i class="fa-solid fa-star checked"></i>
                    <i class="fa-solid fa-star checked"></i>
                    <i class="fa-solid fa-star checked"></i>
                    <i class="fa-solid fa-star checked"></i>
                    <i class="fa-solid fa-star checked"></i>
                </div>
                    <div class="d-flex justify-content-center">
                        <h2 class="ms-5">₱${product.price}</h2>
                        <a href="#" id="heart-link">
                            <i class="wishlist fa-solid fa-heart fa-heart11 ms-4" id="heart_icon"></i>
                        </a>
                    </div>
                    <div class="card-bot text-center">
                        <button type="button" class="btn btn-warning text-white mt-3" onclick="window.location.href='${product.social_link}'">Message</button>
                    </div>
                </div>
            </div>
            </div>`;
        });

        // Assign container to the html element to be displayed
        document.getElementById("get_data").innerHTML = container;

        // Attach event listeners after the content is loaded
         //attachHeartEventListeners();

        // Assign click event on edit btns
        document.querySelectorAll("#btn_edit").forEach((element) => {
            element.addEventListener("click", editAction);
        });

        // Assign click event on Delete Btns
        document.querySelectorAll("#btn_delete").forEach((element) => {
            element.addEventListener("click", deleteAction);
        });
    }

// Delete Functionality
const deleteAction = async (e) => {
    const id = e.target.getAttribute("data-id");

    const { error } = await supabase
        .from('product')
        .delete()
        .eq('product_id', id);

    if (error == null) {
        successNotification("Product successfully deleted!", 15);

        // Reload Datas
        // getDatas();

        // Remove the card from the list
        document.querySelector(`.card[data-id="${id}"]`).remove();
    } else {
        errorNotification("Somethings wrong, Product not deleted!", 15);
        console.log(error);
    }

};

// Storage of ID of chosen data to update
let for_update_id = "";

// Edit Functionality
const editAction = async (e) => {
    const id = e.target.getAttribute("data-id");

    // Get product data from database
    const { data: product, error } = await supabase
        .from('product')
        .select('*')
        .eq('product_id', id);

    if (error == null) {

        // Storage id to a variable; id will be utilized for update
        for_update_id = product[0].product_id;

        // Assign product data to form
        document.querySelector("#post_product [name='product_name']").value = product[0].product_name;
        document.querySelector("#post_product [name='description']").value = product[0].description;
        document.querySelector("#post_product [name='price']").value = product[0].price;
        document.querySelector("#post_product [name='category_name']").value = product[0].category_id;

        // Open Modal
        document.getElementById("modal_show").click();
    } else {
        errorNotification("Somethings wrong, Product not retrieved!", 15);
        console.log(error);
    }
};

// Clear form on modal close
document.getElementById("modal_close").addEventListener("click", () => {
    post_product.reset();
});