"use client";

import Link from "next/link";

export default function ContactCTA() {
    return (
        <section className="contact-cta-section">
            <div className="padding-section contact-cta-container">
                <h2 className="contact-cta-heading">
                    WANT TO COLLAB?
                    <Link href="mailto:barnetv7@gmail.com" className="contact-link">
                        CONTACT ME
                    </Link>
                </h2>
            </div>
        </section>
    );
}
