// Web Audio API function to play sound
const playSound = async (soundType) => {
    let filePath;
    if (soundType === "notification") {
        filePath = "/sound/notification.mp3";
    } else if (soundType === "message") {
        filePath = "/sound/message.mp3";
    }

    try {
        if (!window.notificationAudioContext) {
            window.notificationAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = window.notificationAudioContext;
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    } catch (err) {
        console.error("Audio play failed:", err);
    }
};

export default playSound;
