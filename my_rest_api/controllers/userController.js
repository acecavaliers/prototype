const user = require('../db/models/user')
const jwt = require('jsonwebtoken');
const generateToken = (payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}
exports.addUser = async (req, res) => {
    const { firstName, lastName, email, password} =req.body;
    try {
        
        
        const newUser = await user.create({
          
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password,
        });

        if(!newUser){
            return res.status(400).json({
                status:'fail',
                message: 'Failed to create user'
            });
        }

        const result = newUser.toJSON();
                
        delete result.password;
        result.token = generateToken({
            id: result.id
        })       

        return res.status(201).json({
            status:'success',
            data: result,
        });       

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.logInUser = async (req, res) => {
    const {email, password } = req.body;
    try {
        if(!email || !password){
           return res.status(400).json({
                status:'fail',
                message: 'No email or password'
            });
        }
        const result = await user.findOne({where: {email}});
        if(!result || (password !== result.password)){
            return res.status(401).json({
                status:'fail',
                message: 'Invalid email or password'
            });
        } 
        
        const token = generateToken({
            id: result.id,
        });
       
        return res.status(201).json({
            status:'success',
            token,
        });  

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };