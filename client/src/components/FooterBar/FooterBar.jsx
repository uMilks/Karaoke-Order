export default function FooterBar() {
    return (
        <footer>
            <div className="credits">
                <div className="footer-contacts">
                    <a href="https://github.com/uMilks" target="_blank">
                        <img src="../assets/githublogolilas.ico" className="footer-icon"></img>
                    </a>
                    <a href="https://www.linkedin.com/in/patrick-vieira-leite-17189b313" target="_blank">
                        <img src="../assets/linkedinlogolilas.ico" className="footer-icon"></img>
                    </a>
                    <a href="mailto:patrick.v.leite@gmail.com" target="_blank">
                        <img src="../assets/gmaillogolilas.ico" className="footer-icon"></img>
                    </a>
                </div>
                <div className="credits-name">
                    <p>Desenvolvido por: Patrick Vieira Leite</p>
                </div>
            </div>
        </footer>
    )
}