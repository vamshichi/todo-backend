const express = require('express');
const { authMiddleware } = require('../middleware');
const { Todo, User } = require('../db');
const router = express.Router();
const zod = require('zod');

const todosBody = zod.object({
    title: zod.string(),
    description: zod.string()
});

const updateBody = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    completed: zod.boolean().optional()
});

router.post('/todos', authMiddleware, async (req, res) => {
    const parseResult = todosBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Incorrect inputs",
            errors: parseResult.error.errors
        });
    }

    try {
        const todo = await Todo.create({
            title: req.body.title,
            description: req.body.description,
            completed: false,
            user: req.userId
        });

        await User.findByIdAndUpdate(req.userId, { $push: { todos: todo._id } });

        res.json({
            message: 'Created successfully',
            todo
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.put('/todos/:id', authMiddleware, async (req, res) => {
    const parseResult = updateBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Error while updating information",
            errors: parseResult.error.errors
        });
    }

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json({
            message: "Updated successfully",
            todo: updatedTodo
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.delete('/todos/:id', authMiddleware, async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!deletedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        await User.findByIdAndUpdate(req.userId, { $pull: { todos: req.params.id } });

        res.json({
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});


router.get('/todos',authMiddleware,async(req,res)=>{
    const todos = await Todo.find({user:req.userId});
    res.json({todos})
})

module.exports = router;






// app.get('/todo',async(req,res)=>{
// const todos =await todo.find({});
// res.json({todos});
// })

// app.put('/completed',async(req,res)=>{
//     const jsonData = req.body;
//     const updatePayload = updateTodo.safeParse(jsonData);
//     if(!updatePayload.success){
//         res.status(411).json({
//             message : 'enter the valid input'
//         })
//         return ;
//     }

//     await todo.updateOne({
//         _id : req.body.id 
//     },
//     {
//         completed : true
//     })
//     res.json({
//         msg : 'marked as completed'
//     })

// })

// app.delete('/delete',async(req,res)=>{
//     const jsonData = req.body;
//     const deletePaylode = deleteTodo.safeParse(jsonData);
//     if(!deletePaylode.success){
//         res.status(411).json({
//             message : 'enter the valid input'
//         })
//         return;
//     }
//     await todo.deleteOne({ _id: req.body.id });
//     res.json({
//         msg : 'deleted sucessfully'
//     })

// })

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
//   });