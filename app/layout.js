import "./globals.css";

export const metadata = {
  title: "StudyBench — Math & Physics practice",
  description: "AI-generated practice problems, flashcards, and step-by-step solutions for JKU math & physics exam prep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
