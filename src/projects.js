// Curated from the project repositories; see .notes/RESEARCH.md for verification.
// Order is curated: featured projects first, then open tools, then gated ones.
// `access` picks the status pill icon for projects with entry requirements.
// `art` picks the generative tile illustration in ProjectArt.jsx.
export const projects = [
    {
        name: `Vitamin D Calculator`,
        domain: `vitd.gratis.sh`,
        category: `Calculator`,
        description: `Estimate sun exposure time for vitamin D production based on your location.`,
        art: `sun`,
    },
    {
        name: `Reader`,
        domain: `reader.gratis.sh`,
        category: `Language learning`,
        description: `An EPUB reader with AI translations adapted to your language level. Uses OpenRouter for translation.`,
        note: `Requires an OpenRouter API key`,
        access: `key`,
        art: `pages`,
    },
    {
        name: `Video Journal`,
        domain: `video.gratis.sh`,
        category: `Video`,
        description: `Record short video clips and combine them into a video journal for sharing. Video processing runs locally.`,
        art: `frames`,
    },
    {
        name: `AI Chat`,
        domain: `ai.gratis.sh`,
        category: `Browser-based AI`,
        description: `Chat with language models running locally in your browser. Conversations stay on your device; works offline once the model is downloaded.`,
        art: `chat`,
    },
    {
        name: `Transcribe`,
        domain: `transcribe.gratis.sh`,
        category: `Speech to text`,
        description: `Transcribe audio messages using Whisper. Speech recognition runs locally on your device.`,
        art: `wave`,
    },
    {
        name: `Grapevine`,
        domain: `grapevine.gratis.sh`,
        category: `Community`,
        description: `Share voice and text updates with a community. AI generates bulletins and answers questions using the shared updates.`,
        note: `Members only`,
        access: `members`,
        art: `vine`,
    },
    {
        name: `Halo`,
        domain: `halo.gratis.sh`,
        category: `Recovery tracking`,
        description: `Track recovery trends from Oura data alongside a one-minute vigilance test.`,
        note: `Invite-only beta`,
        access: `invite`,
        art: `rings`,
    },
]
