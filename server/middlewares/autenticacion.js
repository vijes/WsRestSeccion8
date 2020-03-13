const jwt = require('jsonwebtoken');

/**
 * Verificar token
 */
let verificaToken = (req, res, next) => {

    let tokenRes = req.get('token');

    console.log(tokenRes);

    jwt.verify(tokenRes, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    mensaje: 'Token no válido'
                }
            });
        }
        req.usuario = decode.usuario;

        next();
    });
};

/**
 * Verificar role de usuario ADMIN_ROLE
 */
let verificarRoleAdmin = (req, res, next) => {

    let usuarioDB = req.usuario;

    console.log(`usuario ${usuarioDB}`);

    if (usuarioDB.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                mensaje: `El usuario ${usuarioDB.nombre} no tiene permisos de administrador`
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificarRoleAdmin
};