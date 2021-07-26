import React from "react";
import { getHeaderTitle } from "../../app/common/constants/HeaderLinks";
function PPMSFooter() {
  return (
    <>
      <div className="grid-container usa-footer__return-to-top">
        <a id="0-link-footer" href="#">
          Return to top
        </a>
      </div>

      <div className="usa-footer__secondary-section">
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-4">
              <div className="mobile-lg:grid-col-auto">
                <img
                  className="usa-footer__logo-img"
                  src="/logo-img.svg"
                  alt="footer-image"
                />
              </div>
              <div className="mobile-lg:grid-col-auto">
                <h3 className="usa-footer__logo-heading">{getHeaderTitle()}</h3>
              </div>
            </div>
            <div className="usa-footer__contact-links mobile-lg:grid-col-6">
              <div className="usa-footer__social-links grid-row grid-gap-1">
                <div className="grid-col-auto">
                  <a
                    id="1-link-footer"
                    className="usa-social-link usa-social-link--facebook"
                    href="#"
                  >
                    <span>Facebook</span>
                  </a>
                </div>
                <div className="grid-col-auto">
                  <a
                    id="2-link-footer"
                    className="usa-social-link usa-social-link--twitter"
                    href="#"
                  >
                    <span>Twitter</span>
                  </a>
                </div>
                <div className="grid-col-auto">
                  <a
                    id="3-link-footer"
                    className="usa-social-link usa-social-link--youtube"
                    href="#"
                  >
                    <span>YouTube</span>
                  </a>
                </div>
                <div className="grid-col-auto">
                  <a
                    id="4-link-footer"
                    className="usa-social-link usa-social-link--rss"
                    href="#"
                  >
                    <span>RSS</span>
                  </a>
                </div>
              </div>
              <h3 className="usa-footer__contact-heading">PPMS HelpDesk</h3>
              <address className="usa-footer__address">
                <div className="usa-footer__contact-info grid-row grid-gap">
                  <div className="grid-col-auto">
                    <a id="5-link-footer" href="mailto:info@agency.gov">
                      PPMSHelpDesk@gsa.gov
                    </a>
                  </div>
                </div>
              </address>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default PPMSFooter;
