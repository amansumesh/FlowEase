import User from "../models/user.js";

const saveGoogleCredentials = async (req, res) => {
    try {
        const { 
            clientId, 
            clientSecret, 
            phoneNumber, 
            smsNotificationsEnabled, 
            googleCalendarSyncEnabled, 
            syncFrequency 
        } = req.body;

        // Validation: If one Google credential is set, both must be set
        if ((clientId && !clientSecret) || (!clientId && clientSecret)) {
            return res.status(400).json({
                success: false,
                message: "Both Client ID and Client Secret are required if configuring Google credentials."
            });
        }

        const userId = req.session?.user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not logged in"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { 
                clientId, 
                clientSecret, 
                phoneNumber, 
                smsNotificationsEnabled, 
                googleCalendarSyncEnabled, 
                syncFrequency 
            },
            { new: true, runValidators: true }
        );

        req.session.user = user;
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Session save failed"
                });
            }
            res.status(200).json({
                success: true,
                message: "Settings updated successfully",
                user,
            });
        });
    }
    catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export default { saveGoogleCredentials };
