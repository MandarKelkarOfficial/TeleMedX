// import express from "express";
// import pkg from "agora-access-token"; // Import as default
// const { RtcTokenBuilder, RtcRole } = pkg; // Destructure correctly

// const router = express.Router();

// const APP_ID = "581e36bb728245c4823ab3a92e77dbb2";
// const APP_CERTIFICATE = "a0124fbffca846a287408cff78647352";
// const TOKEN_EXPIRATION_TIME = 3600; // 1-hour token validity

// router.get("/agora-token", (req, res) => {
//     const { channelName } = req.query;
//     if (!channelName) {
//         return res.status(400).json({ error: "Channel name is required" });
//     }

//     const token = RtcTokenBuilder.buildTokenWithUid(
//         APP_ID,
//         APP_CERTIFICATE,
//         channelName,
//         0, // UID (set to 0 for dynamic assignment)
//         RtcRole.PUBLISHER,
//         Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_TIME
//     );

//     res.json({ token });
// });

// export default router;