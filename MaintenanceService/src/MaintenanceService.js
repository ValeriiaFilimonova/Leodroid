'use strict';

// const archiveUrl = 'https://failiem.lv/down.php?i=ccmn5rdn&n=weatherservice.zip';
const archiveUrl = 'https://failiem.lv/down.php?i=6zzd3fbu&n=validpackage.zip';
// const archiveUrl = 'https://failiem.lv/down.php?i=yfhnf4kb&n=corruptedpackage.zip';

const ServiceRegister = require('./ServiceRegister');

// ServiceRegister.add(archiveUrl)
//     .then(() => process.exit(0))
//     .catch((err) => {
//         console.trace(err);
//         process.exit(1);
//     });

ServiceRegister.remove('weather')
    .then(() => process.exit(0))
    .catch((err) => {
        console.trace(err);
        process.exit(1);
    });
