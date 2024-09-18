import { supabase, successNotification, errorNotification, doLogout } from "../main";

const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = doLogout;

// Constants
const ProductImageUrl = 'https://smqftzwqdgfqxjuiwkrg.supabase.co/storage/v1/object/public/products/';
const profile_img_url ='https://smqftzwqdgfqxjuiwkrg.supabase.co/storage/v1/object/public/profile/';

// Logout functionality
document.getElementById("btn_logout").onclick = doLogout;

// Load data based on URL parameters
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

// Form submission for posting a product

document.getElementById("post_product").onsubmit = async (e) => {
    e.preventDefault();
    
    const submitButton = document.querySelector("#post_product button[type='submit']");
    submitButton.disabled = true;
    submitButton.innerHTML = `<span>Loading...</span>`;

    const formData = new FormData(post_product);
    const image = formData.get("image_path");

    try {
        // Upload Product Image
        const { data: imageUploadData, error: imageUploadError } = await supabase
            .storage
            .from('products')
            .upload("public/" + image.name, image, {
                cacheControl: '3600',
                upsert: true,
            });

        if (imageUploadError) throw imageUploadError;

        // Fetch user information
        const userId = localStorage.getItem("user_id");
        if (!userId) throw new Error("User ID not found in local storage.");

        console.log("User ID from local storage:", userId);  // Debugging line

        const { data: userData, error: userError } = await supabase
            .from('user_information')
            .select('first_name, last_name, profile_pic,fb_link')
            .eq('user_id', userId)
            .limit(1);  // Ensure only one row is fetched

        if (userError) {
            console.error("Error fetching user information:", userError); // Debugging line
            throw userError;
        }

        console.log("Raw user data response:", userData);  // Debugging line

        if (!userData || userData.length === 0) {
            console.log("Query for user information returned no rows. User ID:", userId);  // Debugging line
            throw new Error("User information not found. Please log in again.");
        }

        console.log("User information fetched:", userData[0]);  // Debugging line

        // Insert product with user information
        const { data: productData, error: productError } = await supabase
            .from('product')
            .insert([{
                product_name: formData.get("product_name"),
                product_id: formData.get("product_id"),
                description: formData.get("description"),
                price: formData.get("price"),
                created_at: new Date().toISOString(),
                image_path: imageUploadData?.path ?? null,
                category_name: formData.get("category_name"),
                user_id: userId,  //need to check for references
                // Remove first_name, last_name, profile_pic fields
                //for fetchhing element
                profile_pic: userData[0]?.profile_pic ?? null,
                first_name: userData[0]?.first_name ?? null,
                last_name: userData[0]?.last_name ?? null,
                fb_link: userData[0]?.fb_link ?? null,
            }])
            .select();

        if (productError) throw productError;

        successNotification("Product successfully posted!", 3);
        getDatas();
        document.getElementById("modal_close").click();
        post_product.reset();

    } catch (error) {
        if (error.message.includes("User information not found")) {
            errorNotification("Error posting product: " + error.message + " Redirecting to login.", 15);
            setTimeout(() => {
                doLogout(); // Redirect to login
            }, 3000);
        } else {
            errorNotification("Error posting product: " + error.message, 15);
        }
        console.error(error);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = `Submit`;
    }
};


// Load data functionality
async function getDatas(keyword = "", category = "") {
    try {
        let query = supabase
            .from('product')
            .select('*')
            .or(`product_name.ilike.%${keyword}%, description.ilike.%${keyword}%`);

        if (category) {
            query = query.eq('category_name', category);
        }

        const { data: products, error } = await query;
        if (error) throw error;

        let container = "";
        products.forEach((product) => {
            container += `
                <div class="col-md-3 py-3 mt-3 py-md-0">
                    <div class="card" data-id="${product.product_id}">
                        <div class="dropdown mt-2 me-3">
                            <a class="btn btn-warning text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"></a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" id="btn_edit" data-id="${product.product_id}">Edit</a></li>
                                <li><a class="dropdown-item" href="#" id="btn_delete" data-id="${product.product_id}">Delete</a></li>
                            </ul>

                        </div>
                        <small class="fw-bold ">posted by: ${product.first_name} ${product.last_name}</small>
                        <div class="img__container" id="profile_pic">
                        <img src="${profile_img_url  + product.profile_pic}" alt="notfound">
                        <span></span>
                    </div>

                        <div class="img__container" id="profile_pic">
                            <img src="${ProductImageUrl + product.image_path}" alt="Image not found">
                            <span></span>
                        </div>
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
                            <h2>${product.price}</h2>
                            <div class="card-bot text-center">
                                <button type="button" class="btn btn-warning" onclick="window.location.href='${product.fb_link}'">Message</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        document.getElementById("get_data").innerHTML = container;

        // Assign click events to edit and delete buttons
        document.querySelectorAll("#btn_edit").forEach(element => element.addEventListener("click", editAction));
        document.querySelectorAll("#btn_delete").forEach(element => element.addEventListener("click", deleteAction));

    } catch (error) {
        errorNotification("Error loading products: " + error.message, 15);
        console.error(error);
    }
}

// Delete functionality
const deleteAction = async (e) => {
    const id = e.target.getAttribute("data-id");
    try {
        const { error } = await supabase
            .from('product')
            .delete()
            .eq('id', id);

        if (error) throw error;

        successNotification("Product successfully deleted!", 15);
        document.querySelector(`.card[data-id="${id}"]`).remove();

    } catch (error) {
        errorNotification("Something went wrong, product not deleted: " + error.message, 15);
        console.error(error);
    }
};

// Placeholder for the update ID
let for_update_id = "";

// Edit Functionality
const editAction = async (e) => {
    const id = e.target.getAttribute("data-id");

    // Get product data from database
    const { data: product, error } = await supabase
        .from('product')
        .select('*')
        .eq('id', id);

    if (error == null) {

        // Storage id to a variable; id will be utilized for update
        for_update_id = product[0].product_id;

        // Assign product data to form
        document.querySelector("#post_product [name='product_name']").value = product[0].product_name;
        document.querySelector("#post_product [name='description']").value = product[0].description;
        document.querySelector("#post_product [name='price']").value = product[0].price;
        document.querySelector("#post_product [name='category_name']").value = product[0].category_name;

        // Open Modal
        document.getElementById("modal_show").click();
    } else {
        errorNotification("Somethings wrong, Product not retrieved!", 15);
        console.log(error);
    }
};