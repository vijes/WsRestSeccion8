//********************** */
// Puerto
//********************** */
process.env.PORT = process.env.PORT || 3000;

//********************** */
// Entorno
//********************** */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//********************** */
// Venicmiento del token
//********************** */
// 60 segundos
// 60minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// process.env.CADUCIDAD_TOKEN = 5;

//********************** */
// Seed o semilla de autenticacion
//********************** */
//secret-prueba
process.env.SEED = process.env.SEED || 'semilla-secreta-desarrollo';

//********************** */
// URL
//********************** */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URLDB;
}

process.env.URLDB = urlDB;