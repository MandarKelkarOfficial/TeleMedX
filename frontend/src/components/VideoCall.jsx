// import React, { useEffect, useRef, useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { useParams } from "react-router-dom";

// const APP_ID = "581e36bb728245c4823ab3a92e77dbb2"; // Your Agora App ID
// const TOKEN_SERVER_URL = "http://localhost:4000/api/agora/agora-token";

// const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

// const VideoCall = () => {
//     const { docId } = useParams(); // Doctor ID as channel name
//     const [joined, setJoined] = useState(false);
//     const localContainer = useRef(null);
//     const remoteContainer = useRef(null);
//     const localTracks = useRef([]);

//     useEffect(() => {
//         const joinChannel = async () => {
//             try {
//                 // Fetch Agora token from backend
//                 const response = await fetch(`${TOKEN_SERVER_URL}?channelName=${docId}`);
//                 const { token } = await response.json();
                
//                 // Join Agora Channel
//                 await client.join(APP_ID, docId, token, null);

//                 // Create and play local video
//                 localTracks.current = await AgoraRTC.createMicrophoneAndCameraTracks();
//                 localTracks.current[1].play(localContainer.current);
                
//                 // Publish local tracks
//                 await client.publish(localTracks.current);
//                 setJoined(true);

//                 // Handle Remote Users
//                 client.on("user-published", async (user, mediaType) => {
//                     await client.subscribe(user, mediaType);
//                     if (mediaType === "video") {
//                         const player = document.createElement("div");
//                         player.id = user.uid;
//                         remoteContainer.current.appendChild(player);
//                         user.videoTrack.play(player);
//                     }
//                     if (mediaType === "audio") {
//                         user.audioTrack.play();
//                     }
//                 });

//                 client.on("user-unpublished", (user) => {
//                     const player = document.getElementById(user.uid);
//                     if (player) player.remove();
//                 });

//             } catch (error) {
//                 console.error("Agora Error:", error);
//             }
//         };

//         joinChannel();

//         return () => {
//             localTracks.current.forEach(track => track.stop() && track.close());
//             client.leave();
//         };
//     }, [docId]);

//     return (
//         <div>
//             <h2>Agora Video Consultation</h2>
//             <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
//                 <div ref={localContainer} style={{ width: "300px", height: "300px", background: "black" }}></div>
//                 <div ref={remoteContainer} style={{ width: "300px", height: "300px", background: "black" }}></div>
//             </div>
//             {!joined && <p>Joining the video call...</p>}
//         </div>
//     );
// };

// export default VideoCall;