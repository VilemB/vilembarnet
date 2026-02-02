"use client";

import Button from "@/components/Button";

export default function DesignEthos() {
    return (
        <section className="ethos-section">
            <div className="padding-section ethos-grid">
                <div className="ethos-top-left">
                    <h2 className="ethos-heading">
                        DESIGN SHOULD EVOKE EMOTION AND FEEL NATURAL.
                    </h2>
                </div>

                <div className="ethos-bottom-left">
                    <Button href="/work" className="ethos-button">
                        EXPLORE MY WORK
                    </Button>
                </div>

                <div className="ethos-bottom-right">
                    <p className="ethos-text">
                        BEYOND STRUCTURE AND USABILITY, DESIGN IS ABOUT HOW THINGS FEEL. I FOCUS ON BUILDING DIGITAL EXPERIENCES THAT EARN ATTENTION THROUGH THOUGHTFUL INTERACTION, VISUAL CLARITY, AND CARE FOR DETAIL, CREATING INTERFACES THAT FEEL NATURAL AND CONSIDERED.
                    </p>
                </div>
            </div>
        </section>
    );
}
