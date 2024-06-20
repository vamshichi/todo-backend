const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
// const { authMiddleware } = require("../middleware")

const signupBody = zod.object({
    email: zod.string().email(),
	name: zod.string(),
	password: zod.string()
})

router.post("/signup",async(req,res)=>{
  const {success} = signupBody.safeParse(req.body)
  if(!success){
    res.status(411).json({
        meg : "Email already taken / Incorrect inputs"
    })
  }
  const existingUser = await User.findOne({
    email: req.body.email
})

if (existingUser) {
    return res.status(411).json({
        message: "Email already taken/Incorrect inputs"
    })
}

const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
})
const userId = user._id;

const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

})

const signinBody = zod.object({
    email: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

// const todosBody = zod.object({
//     title: zod.string().email(),
// 	description: zod.string()
// })

// router.post('/todos',authMiddleware,async(req,res)=>{
//     const { success } = todosBody.safeParse(req.body)
//     if (!success) {
//         return res.status(411).json({
//             message: "Incorrect inputs"
//         })
//     }
//      await Todo.create({
//         title: postPayload.data.title,
//         description: postPayload.data.description,
//         completed: false
//     })
//     res.json({
//                 message: 'Created successfully',
//             });
// })



module.exports = router;