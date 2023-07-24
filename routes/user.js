const router = require("express").Router()
const { User } = require("../model/index")
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const authenticateToken = require("../middleware/authenticateToken")



router.get('/', (req, res) => {
    res.send("user route")
})



router.post('/login', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)
    const user = await new User({ email: req.body.email, password: hash }).save()

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }

    })

    const user1 = await User.findOne({ "email": req.body.email })

    const token = await jwt.sign({ user1 }, process.env.SECRET_KEY)

    const details = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "conformation mail",
        text: `
        authentication task
       
        `,
        html: `
        <h1>verify link</h1>
         </br>
        <a href="http://localhost:4000/api/user/verify/${token}">click me</a>
        `
    }

    mailTransporter.sendMail(details, (err) => {
        if (err) {
            return console.log(err)
        }
        else {
            return console.log("email has send")
        }
    })


    res.json(user)
})


router.get('/verify/:token', authenticateToken, async (req, res) => {
    return res.send("verified")
})




router.post('/passwordReset', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            const encrypt = bcrypt.compareSync(req.body.password, user.password)
            console.log(encrypt)

            if (encrypt) {
                const hash = await bcrypt.hash(req.body.changedPassword, 8)
                await User.findOneAndUpdate({ email: req.body.email }, { password: hash })
            }
            else {
                return res.send("incorrect password")
            }
        }
        else {
            return res.send("Enter correct email or password")
        }
        res.json({ user })
    }
    catch (err) {
        res.json({ msg: err.message })
    }

})

module.exports = router