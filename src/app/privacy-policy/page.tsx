import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy — Total Solutions",
    description: "Our privacy policy and data protection practices.",
};

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 100, paddingBottom: 80 }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <h1 style={{ marginBottom: 32 }}>Privacy Policy</h1>
                    <div style={{ color: "var(--text-light)", lineHeight: 1.8 }}>
                        <p style={{ marginBottom: 20 }}>
                            Last updated: February 25, 2026
                        </p>
                        <p style={{ marginBottom: 24 }}>
                            At Total Solutions, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>1. Information We Collect</h2>
                        <p style={{ marginBottom: 16 }}>
                            We collect information you provide directly to us, such as when you request a quote, submit a review, or communicate with us via WhatsApp or email. This may include:
                        </p>
                        <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                            <li>Name and contact information</li>
                            <li>Company details</li>
                            <li>Project specifications and artwork</li>
                            <li>Delivery addresses</li>
                        </ul>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>2. How We Use Your Information</h2>
                        <p style={{ marginBottom: 16 }}>
                            We use the collected information to:
                        </p>
                        <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                            <li>Provide custom printing quotes and services</li>
                            <li>Process and deliver your orders</li>
                            <li>Communicate regarding project updates</li>
                            <li>Improve our website and customer experience</li>
                        </ul>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>3. Data Security</h2>
                        <p style={{ marginBottom: 24 }}>
                            We implement appropriate security measures to protect your personal data from unauthorized access, alteration, or disclosure. However, please note that no method of transmission over the internet is 100% secure.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>4. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            <strong>Email:</strong> totalsolutionsnoida@gmail.com
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
