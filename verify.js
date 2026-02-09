const http = require('http');

const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/auth/login',
    'http://localhost:3000/style.css',
    'http://localhost:3000/home.css',
    'http://localhost:3000/cart.css',
    'http://localhost:3000/login.css',
    'http://localhost:3000/logo.png'
];

console.log("Checking endpoints...");
let pending = urls.length;

urls.forEach(url => {
    http.get(url, (res) => {
        console.log(`${url} - Status Code: ${res.statusCode}`);
        // Consume response data to free up memory
        res.resume();
        pending--;
        if (pending === 0) console.log("Done.");
    }).on('error', (e) => {
        console.error(`${url} - Error: ${e.message}`);
        pending--;
         if (pending === 0) console.log("Done.");
    });
});
