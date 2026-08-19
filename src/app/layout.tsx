import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LaTeX Documentation Workspace',
  description: 'Sleek, modular LaTeX authoring environment with live PDF preview and diagnostics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="bg-editor-bg text-editor-text antialiased selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
