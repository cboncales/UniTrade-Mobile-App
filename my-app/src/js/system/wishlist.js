 import { supabase, successNotification, errorNotification, doLogout } from "../main";

const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = doLogout;

/* // Constants
const ProductImageUrl = 'https://smqftzwqdgfqxjuiwkrg.supabase.co/storage/v1/object/public/products/';
const profile_img_url = 'https://smqftzwqdgfqxjuiwkrg.supabase.co/storage/v1/object/public/profile/';

async function getWishlist() {
    try {
        const userId = localStorage.getItem("user_id");
        if (!userId) throw new Error("User ID not found in local storage.");

        // Fetch wishlist items
        const { data: wishlist, error: wishlistError } = await supabase
            .from('wishlist')
            .select('product_id')
            .eq('user_id', userId);

        if (wishlistError) throw wishlistError;

        if (!wishlist.length) {
            document.getElementById("wishlist_data").innerHTML = "<p>No items in wishlist.</p>";
            return;
        }

        // Fetch product details for wishlist items
        const productIds = wishlist.map(item => item.product_id);
        const { data: products, error: productsError } = await supabase
            .from('product')
            .select(`
                product_id,
                product_name,
                description,
                price,
                image_path,
                user_information_id,
                user_information: user_information_id (
                    first_name,
                    last_name,
                    profile_pic,
                    fb_link
                )
            `)
            .in('product_id', productIds);

        if (productsError) throw productsError;

        let container = "";
        products.forEach((product) => {
            container += `
                <div class="col-md-3 py-3 mt-3 py-md-0">
                    <div class="card" data-id="${product.product_id}">
                        <small class="fw-bold">posted by: ${product.user_information.first_name} ${product.user_information.last_name}</small>
                        <div class="img__container" id="profile_pic">
                            <img src="${profile_img_url + product.user_information.profile_pic}" alt="Profile image not found">
                            <span></span>
                        </div>
                        <div class="img__container" id="product_image">
                            <img src="${ProductImageUrl + product.image_path}" alt="Product image not found">
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
                                <button type="button" class="btn btn-warning" onclick="window.location.href='${product.user_information.fb_link}'">Message</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        document.getElementById("wishlist_data").innerHTML = container;

    } catch (error) {
        errorNotification("Error loading wishlist: " + error.message, 15);
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Check if on the wishlist page or if you have a specific button to view the wishlist
    if (document.getElementById("wishlist_data")) {
        getWishlist();
    }
}); */ 