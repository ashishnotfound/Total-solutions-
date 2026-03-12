import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Terms of Service — Total Solutions",
    description: "Terms and conditions for using Total Solutions services.",
};

export default function TermsOfService() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 100, paddingBottom: 80 }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <h1 style={{ marginBottom: 32 }}>Terms of Service</h1>
                    <div style={{ color: "var(--text-light)", lineHeight: 1.8 }}>
                        <p style={{ marginBottom: 20 }}>
                            Effective Date: February 25, 2026
                        </p>
                        <p style={{ marginBottom: 24 }}>
                            By accessing or using the Total Solutions website and services, you agree to be bound by these Terms of Service.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>1. Service Terms</h2>
                        <p style={{ marginBottom: 16 }}>
                            Total Solutions provides professional printing, signage, and branding services. All quotes provided are valid for 15 days from the date of issuance unless otherwise stated.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>2. Artwork & Copyright</h2>
                        <p style={{ marginBottom: 16 }}>
                            Users are responsible for ensuring they have the legal right to use and print any artwork or designs submitted to us. Total Solutions is not liable for any copyright infringement resulting from customer-supplied materials.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>3. Quality & Approval</h2>
                        <p style={{ marginBottom: 16 }}>
                            While we maintain strict quality control, slight variations in color and finish may occur depending on the material and printing process. Customers are requested to approve digital or physical proofs before final production.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>4. Payments & Delivery</h2>
                        <p style={{ marginBottom: 24 }}>
                            Payment terms will be specified in the formal quote. Production timelines begin only after receipt of advance payment and final artwork approval. Delivery times are estimates and may vary.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>5. Limitation of Liability</h2>
                        <p style={{ marginBottom: 24 }}>
                            Total Solutions shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or website.
                        </p>

                        <h2 style={{ color: "var(--text)", marginTop: 40, marginBottom: 16 }}>6. Contact</h2>
                        <p>
                            For any inquiries regarding these terms, please contact:
                            <br />
                            <strong>Phone:</strong> +91-9958628702
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
