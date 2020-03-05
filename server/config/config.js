//********************** */
// Puerto
//********************** */
process.env.PORT = process.env.PORT || 3000;

//********************** */
// Entorno
//********************** */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//********************** */
// URL
//********************** */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://vijes:OyLAcjP11tF2rfQF@cluster0-uje6t.mongodb.net/cafe';
}

process.env.URLDB = urlDB;