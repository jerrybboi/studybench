const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token) {
  if (!SECRET_KEY || !token) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: SECRET_KEY,
          response: token,
        }),
      }
    );

    const data = await response.json();

    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}