let cart = [];

function addToCart(product){ 
  cart.push(product); 
  console.log("Cart:", cart); 

  
  document.getElementById("cartCount").innerText = cart.length;

  \
  const msg = document.getElementById("cartMessage");
  msg.classList.remove("opacity-0"); 
  setTimeout(() => {
    msg.classList.add("opacity-0"); 
  }, 2000);
}



document.getElementById("cartBtn").addEventListener("click", ()=>console.log("Cart clicked"));
document.getElementById("wishlistBtn").addEventListener("click", ()=>console.log("Wishlist clicked"));
document.getElementById("profileBtn").addEventListener("click", ()=>{
  const username = prompt("Enter username:");
  if(username){ localStorage.setItem("shopifyUser", username); alert("Profile saved for " + username); }
});
document.getElementById("searchInput").addEventListener("keypress", e=>{
  if(e.key==="Enter") console.log("Search for:", e.target.value);
});