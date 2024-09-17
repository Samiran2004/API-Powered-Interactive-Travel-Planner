const User = require('../../models/userModel');
const cloudinary = require('../../service/cloudinaryService');
const fs = require('fs');

const updateProfilePicture = async (req, res) => {
    try {
        // Check if the user exists
        const checkUser = await User.findById(req.user._id);
        if (!checkUser) {
            return res.status(404).send({
                status: 'Failed',
                message: "User not found."
            });
        }

        // Upload new profile picture to Cloudinary
        let uploadImageUrl;
        try {
            uploadImageUrl = await cloudinary.uploader.upload(req.file.path);
            fs.unlinkSync(req.file.path);  // Remove from local storage
        } catch (error) {
            return res.status(500).send({
                status: 'Failed',
                message: "Profile picture upload failed."
            });
        }

        // Save the new profile picture URL to the user document
        const previousProfilePictureUrl = checkUser.profilepicture;
        checkUser.profilepicture = uploadImageUrl.url;
        await checkUser.save();

        // Delete the previous profile picture from Cloudinary
        if (previousProfilePictureUrl) {
            try {
                const publicId = previousProfilePictureUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                return res.status(500).send({
                    status: 'Failed',
                    message: "Profile picture updated but previous image could not be deleted from Cloudinary."
                });
            }
        }

        // Success response
        res.status(200).send({
            status: 'Success',
            message: 'Profile picture updated successfully.',
            profilepicture: uploadImageUrl.url
        });

    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal server error."
        });
    }
};

module.exports = updateProfilePicture;