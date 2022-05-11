import React from 'react'

function FooterPage() {
  return (
      <footer>
        <div className="footer-content">
            <h3>A propos de nous</h3>
            <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.
            </p>
            <ul className="socials">
                <li><a href="https://www.facebook.com/"><i className="fa fa-facebook"></i></a></li>
                <li><a href="https://twitter.com/?lang=fr"><i className="fa fa-twitter"></i></a></li>
                <li><a href="https://www.youtube.com/"><i className="fa fa-youtube"></i></a></li>
                <li><a href="https://www.linkedin.com/"><i className="fa fa-linkedin-square"></i></a></li>
            </ul>
        </div>
        <div className="footer-bottom">
            <p>copyright &copy; <a href="#!">Foolish Developer</a>  </p>
                    <div className="footer-menu">
                      <ul className="f-menu">
                        <li><a href="/">Home</a></li>
                        <li><a href="/">About</a></li>
                        <li><a href="/">Contact</a></li>
                        <li><a href="/">Blog</a></li>
                      </ul>
                    </div>
        </div>
      </footer>
  )
}

export default FooterPage;
