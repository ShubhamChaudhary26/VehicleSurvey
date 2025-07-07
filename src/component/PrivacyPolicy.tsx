// app/privacy-policy/page.tsx
import './privacy.css'; // Adjust path based on your project structure
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="privacy-policy-container">
      <div className="header-container">
        <h1>Privacy Policy</h1>
        <Link href="/">
          <button className="back-button">Back to Survey</button>
        </Link>
      </div>
      <p>
        <b>MintSurvey</b> legally registered as <b>Mukraj Insights and Consultancy,</b> LLP, is committed to protecting your privacy and handling your personal data responsibly and transparently. This Privacy Policy explains how we collect, use, disclose, store, and protect your information when you participate in our market research surveys. It also explains your rights and how to exercise them.
      </p>

      <h1 className="header-container">1. Who We Are</h1>

      <p>
        MintSurvey is a research platform operated by <b>Mukraj Insights and Consultancy,</b> LLP, headquartered at:
        <br />
        E401, Paramount, Block E, Kudasan, Gandhinagar – 382421, Gujarat, India.
        <br />
        You may contact us at: <a href="mailto:admin@mintsurvey.com">admin@mintsurvey.com</a>
      </p>

      <h1 className="header-container">2. What Data We Collect</h1>
      <p>We may collect the following types of data from you:</p>
      <ul>
        <li>Demographic information: age, gender, location, occupation, income range, etc.</li>
        <li>Opinions and preferences: your views, choices, and feedback related to products, services, brands, and experiences.</li>
        <li>Technical data: IP address, browser type, device type (for fraud prevention or platform optimization).</li>
        <li>Identifiers (if applicable): email address or phone number, but only when necessary for validation or follow-up (you will always be informed).</li>
        <li>Any other information you voluntarily provide during the survey.</li>
      </ul>
      <p>We do not intentionally collect sensitive personal data unless explicitly required and with your explicit consent.</p>

      <h1 className="header-container">3. Purpose of Data Collection</h1>
      <ul>
        <li>Conducting market and social research</li>
        <li>Analyzing consumer trends and behavior</li>
        <li>Delivering insights to our clients in aggregated and anonymized formats</li>
        <li>Improving survey design and experience</li>
        <li>(If consented) contacting you for follow-up surveys or prize draws</li>
      </ul>
      <p>We do not use your data for direct marketing or advertising.</p>

      <h1 className="header-container">4. Legal Basis for Processing (Under GDPR &amp; Global Laws)</h1>
      <ul>
        <li>Your consent (by agreeing to participate in the survey)</li>
        <li>Legitimate interest (e.g., for improving research quality)</li>
        <li>Compliance with legal obligations</li>
      </ul>
      <p>You can withdraw your consent at any time by contacting us.</p>

      <h1 className="header-container">5. Data Sharing and Disclosure</h1>
      <p>
        We do not sell, rent, or trade your personal data. We may share anonymized, aggregated data with clients or partners for research analysis. Identifiable information is shared only with your explicit consent. In rare cases, we may be required to share data with regulatory bodies or law enforcement if mandated by law.
      </p>

      <h1 className="header-container">6. International Data Transfers</h1>
      <p>
        Our servers or partners may be located in countries outside your own. When transferring data internationally (especially outside the EU/EEA), we ensure safeguards such as:
      </p>
      <ul>
        <li>Standard Contractual Clauses (SCCs)</li>
        <li>Data processing agreements</li>
        <li>Country adequacy decisions by the European Commission</li>
      </ul>

      <h1 className="header-container">7. Data Storage and Security</h1>
      <p>
        All data is stored on secure, encrypted servers and accessed only by authorized personnel. We implement administrative, technical, and physical safeguards to protect your data.
      </p>

      <h1 className="header-container">8. Data Retention</h1>
      <p>
        We retain your data only as long as necessary for the survey&apos;s purpose and legal compliance. Afterward, data is securely deleted or anonymized.
      </p>

      <h1 className="header-container">9. Your Rights</h1>
      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li>Right to access, correct, or delete your data</li>
        <li>Right to restrict or object to processing</li>
        <li>Right to data portability</li>
        <li>Right to withdraw consent</li>
        <li>Right to lodge a complaint with your local data authority</li>
      </ul>
      <p>
        To exercise these rights, email: <a href="mailto:admin@mintsurvey.com">admin@mintsurvey.com</a>
      </p>

      <h1 className="header-container">10. Children&apos;s Privacy</h1>
      <p>
        Our surveys are not intended for children under 16. If we collect such data unknowingly, it will be deleted immediately.
      </p>

      <h1 className="header-container">11. Changes to This Policy</h1>
      <p>
        We may update this policy periodically. Revisions will be posted with a new “Last Updated” date.
      </p>

      <h1 className="header-container">12. Contact Us</h1>
      <p>
        For questions or to exercise your data rights, contact:
        <br />
        MintSurvey
        <br />
        <b>Mukraj Insights and Consultancy,</b> LLP
        <br />
        E401, Paramount, Block E, Kudasan, Gandhinagar – 382421, Gujarat, India
        <br />
        Email: <a href="mailto:admin@mintsurvey.com">admin@mintsurvey.com</a>
        <br />
        Phone: <a href="tel:+917697016792">+91 76970 16792</a>
      </p>

      <p>
        <strong>Last Updated:</strong> 30 June 2025
      </p>
    </main>
  );
}
