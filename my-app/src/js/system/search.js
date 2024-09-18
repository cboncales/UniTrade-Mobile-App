// search.js
import { supabase } from "../main";

// Search Form Function
const search_form = document.getElementById("search-form");

search_form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(search_form);
    const keyword = formData.get("keyword");

    // Redirect to home page with search keyword
    window.location.href = `home.html?keyword=${keyword}`;
}

