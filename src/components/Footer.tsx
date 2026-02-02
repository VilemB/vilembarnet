"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-collab">
                    <p className="footer-collab-text">WANT TO COLLAB?</p>
                    <Link href="mailto:barnetv7@gmail.com" className="footer-email">
                        barnetv7@gmail.com
                    </Link>
                </div>

                <div className="footer-main-row">
                    <div className="footer-socials-left">
                        <Link href="https://x.com/barnetvilem" target="_blank" rel="noopener noreferrer">
                            X (Twitter)
                        </Link>
                        <Link href="https://www.linkedin.com/in/vilém-barnet-497003365/" target="_blank" rel="noopener noreferrer">
                            LinkedIn
                        </Link>
                    </div>

                    <Link href="/" className="footer-logo">
                        <Image
                            src="/logos/logo.svg"
                            alt="VB Logo"
                            width={80}
                            height={80}
                            priority
                        />
                    </Link>

                    <div className="footer-socials-right">
                        <Link href="https://instagram.com/barnetvilem" target="_blank" rel="noopener noreferrer">
                            Instagram
                        </Link>
                        <Link href="https://github.com/vilemb" target="_blank" rel="noopener noreferrer">
                            Github
                        </Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Vilém Barnet</p>
                </div>
            </div>
        </footer>
    );
}