export async function GET() {
    const key = import.meta.env.VITE_OPENAI_API_KEY;

    return json({
        keyLoaded: !!key,
        keyStartsWith: key ? key.substring(0, 10) : null
    });
}
