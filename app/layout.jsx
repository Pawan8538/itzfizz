import "./globals.css";

export const metadata = {
    title: "ITZFIZZ — Scroll Experience",
    description: "Scroll-driven hero section animation",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
