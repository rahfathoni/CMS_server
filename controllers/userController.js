const { User } = require('../models/index');
const { checkPassword } = require('../helpers/bcryptjs');
const { generateToken } = require('../helpers/jwt');

class UserController {
    // router.post('/register', UserController.registerUser);
    static registerUser(req, res, next){
        let { email, password } = req.body;
        let input = {
            email,
            password
        };
        User.create(input)
            .then(data => {
                res.status(201).json({
                    id: data.id,
                    email: data.email,
                    role: data.role
                });
            })
            .catch(err => {
                next(err);
            })
    }

    // router.post('/login', UserController.loginUser);
    static loginUser(req, res, next){
        let { email, password } = req.body;
        let options = {
            where: {
                email,
                role: 'admin'
            }
        }
        User.findOne(options)
            .then(data => {
                if(data){
                    let compare = checkPassword(password, data.password);
                    if(compare) {
                        let token = generateToken({
                            id: data.id,
                            email: data.email
                        })
                        res.status(201).json({
                            token
                        })
                    }
                    else {
                        return next({
                            name: `BadRequest`,
                            errors: [{
                                message: `Invalid E-mail/Password`
                            }]
                        })
                    }
                }
                else {
                    return next({
                        name: `BadRequest`,
                        errors: [{
                            message: `Invalid E-mail/Password`
                        }]
                    })
                }
            })
            .catch(err => {
                return next(err)
            })
    }
}

module.exports = UserController;