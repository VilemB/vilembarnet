import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-logo">
                    <Image
                        src="/logos/logo.svg"
                        alt="Logo"
                        width={40}
                        height={40}
                        priority
                    />
                </Link>
                <div className="navbar-links">
                    <Link href="/work">work</Link>
                    <Link href="/about">about</Link>
                    <Link href="/blog">blog</Link>
                    <Link href="mailto:barnetv7@gmail.com">contact</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
