const { verifyJwtToken } = require("./middleware")
const User = require("../db");

const updateSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(8),
});

router.put("/", verifyJwtToken, async (req,res) => {
    const validation = updateSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(403).json({
            message: "Invalid inputs",
            error: validation.error.errors,
        });
    }

    try {
        await User.updateOne(req.body, {
            id: req.userId
        })
        return res.status(200).json({message: "Updation Successfull"});
    } catch(error) {
        return res.status(403).json({
            message: "Server error",
            error: error.message,
        });
    }
})
