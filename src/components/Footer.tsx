export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 mt-24 py-8 text-center text-gray-500 text-sm">
      <div className="container mx-auto px-4">
        <p>&copy; {currentYear} Vilém Barnet. All rights reserved.</p>
        {/* Optional: Add social links or other info here */}
      </div>
    </footer>
  );
}
