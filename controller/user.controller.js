const db = require('../db')
const {createHash}  =  require("crypto")
const EmailVal = require('../validation/email.validation')
const PasswdVal = require('../validation/password.validation')



class UserController{
    async createUser(req,res){
        const {name,surname,email,password} = req.body
        const validation = EmailVal(email)
        if (req.body.email != undefined){
            if (validation == true){
                const db_check = await db.query(`SELECT * FROM person where email=$1`,[email])
                if (db_check.rows.length == 0){
                    if (req.body.password != undefined){
                        const pass_vd = PasswdVal(password)
                        if (pass_vd == true){
                            const hashed_pass = createHash('sha256').update(password).digest('hex')
                            const newPerson = await db.query('INSERT INTO person (name,surname,email,password) VALUES ($1,$2,$3,$4) RETURNING name,surname,email,password',
                            [name,surname,email,hashed_pass])
                            res.json({
                                id: newPerson.rows[0].id,
                                name: newPerson.rows[0].name,
                                surname: newPerson.rows[0].surname,
                                email: newPerson.rows[0].email,
                                msg: 'Registration done!'
                              })
                        }
                        else{
                            res.json({'msg':'password is invalid'})
                        }
                    }
                    else{
                        res.json({"msg":"password is required"})
                    }
                }
                else{
                    res.json({'msg':"user with this email already exists"})
                }
                    
            }
            else{
                res.json({'msg':'email is invalid'})
            }
        }
        else
            res.json({"msg":"Email is required"})



        // const newPerson = await db.query(`INSERT INTO person (name,surname) values ($1,$2) RETURNING *`,[name,surname])
        // res.json(newPerson.rows[0])
    }
    async getUsers(req,res){
        const users = await db.query('SELECT * FROM person')
        res.json(users.rows)
    }
    async getOneUser(req,res){
        const id = req.params.id
        const user = await db.query('SELECT * FROM person WHERE id=$1',[id])
        res.json(user.rows)
    }
    async updateUser(req,res){
        const {id,name,surname} = req.body
        const user = await db.query('UPDATE person set name=$1,surname=$2 where id = $3 RETURNING *',
        [name,surname,id]
        ) 
        res.json(user.rows[0])
    }
    async deleteUser(req,res){
        const id = req.params.id
        const user = await db.query('DELETE FROM person WHERE id=$1',[id])
        res.json({'msg':'Deleted'})
    }
    async signIn(req,res){
        const {email,password} = req.body
        const user = await db.query(`SELECT * FROM "person" WHERE email='${email}';`)
        if (user.rows.length != 0 ){
            const hashed = createHash('sha256').update(password).digest('hex')
            if(user.rows[0].password===hashed){
                res.json({'msg':'Success!'})
            }
            else{
                res.json({'msg': 'Incorrect password'})
            }
        }
        else{
            res.json({'msg': 'User didnt register'})
        }
    }
    
}


module.exports = new UserController()
