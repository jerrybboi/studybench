import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

export const metadata = {
  title: "StudyBench | Learn, practice, understand",
  description: "A digital learning space for reading, practice, AI-assisted study, and Web3 education.",
  icons: {
    icon: "/studybench-logo.svg",
    shortcut: "/studybench-logo.svg",
    apple: "/studybench-logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
