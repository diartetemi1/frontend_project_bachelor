import classes from './FooterComponent.css';

const FooterComponent = () => {
  return (
    <div className='footer-container'>
      <footer className="footer">
        <nav className="navbar navbar-expand-md navbar-dark bg-light">
          <span className="text-secondary">
            Deutsch • Englisch (US) • Español (Spanisch) • Français (Französisch) • Shqip (Albanisch) • Türkçe (Türkisch) • العربية (Arabisch) • Polski (Polnisch)
          </span>
        </nav>{" "}
      </footer>
    </div>
  );
};
export default FooterComponent;
