const { link } = require('fs');

 const urls = [
        { name: 'Facebook', link: 'https://www.facebook.com' },
    ];

console.info(`\n======================================== Table ========================================\n`)
console.table(urls)
console.info(`\n======================================== Info =========================================`)

module.exports = {urls};
