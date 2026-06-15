const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(cors());

app.get('/rtc/:channel/publisher/uid/:uid', (req, res) => {
    const appId = process.env.APP_ID;
    const appCertificate = process.env.APP_CERTIFICATE;
    const channelName = req.params.channel;
    const uid = parseInt(req.params.uid) || 0;
    const role = RtcRole.PUBLISHER;

    if (!appId || !appCertificate) {
        return res.status(500).json({ error: 'Environment variables are missing' });
    }

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
    return res.json({ rtcToken: token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
