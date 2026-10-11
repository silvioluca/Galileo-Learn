export function Footer() {
  return (
    <footer className="border-t border-ink-300/25 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-500">
        <p>© {new Date().getFullYear()} Galileo Learn. Impara facendo.</p>
      </div>
    </footer>
  );
}
