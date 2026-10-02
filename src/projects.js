// Curated from the project repositories; see .notes/RESEARCH.md for verification.
// `access` picks the status pill icon for projects with entry requirements.
export const projects = [
    {
        name: `AI Chat`,
        domain: `ai.gratis.sh`,
        category: `Browser-based AI`,
        description: `Chat with language models running locally in your browser. Conversations stay on your device; works offline once the model is downloaded.`,
    },
    {
        name: `Reader`,
        domain: `reader.gratis.sh`,
        category: `Language learning`,
        description: `An EPUB reader with AI translations adapted to your language level. Uses OpenRouter for translation.`,
        note: `Requires an OpenRouter API key`,
        access: `key`,
    },
    {
        name: `Transcribe`,
        domain: `transcribe.gratis.sh`,
        category: `Speech to text`,
        description: `Transcribe audio messages using Whisper. Speech recognition runs locally on your device.`,
    },
    {
        name: `Video Journal`,
        domain: `video.gratis.sh`,
        category: `Video`,
        description: `Record short video clips and combine them into a video journal for sharing. Video processing runs locally.`,
    },
    {
        name: `Vitamin D Calculator`,
        domain: `vitd.gratis.sh`,
        category: `Calculator`,
        description: `Estimate sun exposure time for vitamin D production based on your location.`,
    },
    {
        name: `Grapevine`,
        domain: `grapevine.gratis.sh`,
        category: `Community`,
        description: `Share voice and text updates with a community. AI generates bulletins and answers questions using the shared updates.`,
        note: `Members only`,
        access: `members`,
    },
    {
        name: `Halo`,
        domain: `halo.gratis.sh`,
        category: `Recovery tracking`,
        description: `Track recovery trends from Oura data alongside a one-minute vigilance test.`,
        note: `Invite-only beta`,
        access: `invite`,
    },
]
