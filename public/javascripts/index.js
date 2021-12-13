// window.addEventListener("load", (event)=>{
//     console.log("hello from javascript!")
// })

document.addEventListener("DOMContentLoaded", async() => {
    try {
        const res = await fetch("http://localhost:8080/app/#all", {
            headers: {}
        });

        // Load elements of home page
        const { tasks } = await res.json();
        
        // Redirect un-authenticated users
        if (res.status === 401) {
            window.location.href = '/not-found';
            return;
        }
    } catch (e) {
        console.error(e);
    }
});
