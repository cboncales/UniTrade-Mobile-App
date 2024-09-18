import { supabase, successNotification, errorNotification, doLogout } from "../main";

const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = doLogout;

const itemsImageUrl = "https://znurbodoeuuhqkgdxvql.supabase.co/storage/v1/object/public/images/";
const profile_img_url = 'https://znurbodoeuuhqkgdxvql.supabase.co/storage/v1/object/public/users_image/';

document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("user_id");

    if (userId) {
        getDatas(userId);
        getUserPosts(userId); // Load user-specific posts
    } else {
        console.error("User ID not found in localStorage");
    }
});

async function getDatas(userId) {
    try {
        const { data: userInfo, error: userInfoError } = await supabase
            .from('user_information')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (userInfoError) {
            throw userInfoError;
        }

        if (userInfo) {
            const container = `
                <div class="img__container" id="profile_pic">
                    <img src="${profile_img_url + userInfo.profile_pic}" alt="">
                    <span></span>
                </div>
                <br><br>
                <h3 class="fw-bold">${userInfo.first_name} ${userInfo.last_name}</h3>
                <ul class="about">
                </ul>
                <div class="content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio voluptas voluptatum tempora incidunt, sint voluptates? Quaerat corrupti explicabo ratione tempora fuga illum, repudiandae a sequi aliquid nulla fugiat veniam temporibus.</p>
                    <button type="button" class="btn btn-warning" onclick="window.location.href='${userInfo.fb_link}'">Message</button>
                    <ul>
                        <li><i class="fab fa-twitter"></i></li>
                        <li><i class="fab fa-facebook"></i></li>
                        <li><i class="fab fa-telegram"></i></li>
                        <li><i class="fab fa-instagram"></i></li>
                    </ul>                          
                    <a href="account.html?user_id=${userInfo.id}"><button>Edit Profile</button></a>
                </div>
            `;

            document.getElementById("get_data").innerHTML = container;
            const backgroundPic = document.getElementById('background-pic');
            backgroundPic.style.backgroundImage = `url('${itemsImageUrl + userInfo.bg_pic}')`;
        } else {
            console.error('Error: User information not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function getUserPosts(userId) {
    try {
        // Fetch products where the product's user_information_id matches the user's id
        const { data: products, error: productsError } = await supabase
            .from('product')
            .select(`
                product_id,
                product_name,
                description,
                price,
                image_path,
                user_information!inner (
                    user_id
                )
            `)
            .eq('user_information.user_id', userId); // Ensure this matches the auth.users.id

        if (productsError) {
            throw productsError;
        }

        let container = "";
        products.forEach(product => {
            container += `
                <div class="col-md-3 py-3 mt-3 py-md-0">
                    <div class="card" data-id="${product.product_id}">
                        <div class="dropdown mt-2 me-3">
                          <a class="btn btn-warning text-white dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          </a>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" id="btn_edit" data-id="${product.product_id}">Edit</a></li>
                            <li><a class="dropdown-item" href="#" id="btn_delete" data-id="${product.product_id}">Delete</a></li>
                          </ul>
                        </div>
                        <div class="card-head">
                            <img id="photo" src="${itemsImageUrl + product.image_path}" alt="">
                        </div>
                        <div class="card-body">
                            <h3 class="text-center">${product.product_name}</h3>
                            <p class="text-center">${product.description}</p>
                            <div class="d-flex justify-content-center">
                                <h2 class="ms-5">₱${product.price}</h2>
                                <i class="wishlist-icon fa-solid fa-heart ms-4"></i>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        document.getElementById("get_posts").innerHTML = container;

        // Assign click event on edit buttons
        document.querySelectorAll("#btn_edit").forEach((element) => {
            element.addEventListener("click", editAction);
        });

        // Assign click event on delete buttons
        document.querySelectorAll("#btn_delete").forEach((element) => {
            element.addEventListener("click", deleteAction);
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
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