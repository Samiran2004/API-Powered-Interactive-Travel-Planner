const User = require("../../models/userModel");

const getUserHistory = async(req,res)=>{
    try {
        //Fetch the user id from token..
        const userId = req.user._id;
        
        //Check the user is exist in database or not...
        const user = await User.findById(userId).populate("recommendationhistory");
        if(!user){
            return res.status(404).send({
                status: 'Failed',
                message: "User Not Found."
            });
        }
        return res.status(200).send({
            status: 'Success',
            data: user.recommendationhistory
        });
        
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error"
        });
    }
}

module.exports = getUserHistory;