import React from "react";
import PPMSCardHeader from "./components/common/card/PPMS-card-header";
import PPMSCard from "./components/common/card/PPMS-card";
import PPMSCardBody from "./components/common/card/PPMS-card-body";
import PPMSCardFooter from "./components/common/card/PPMS-card-footer";
import { PPMSButton } from "./components/common/PPMS-button";
import PPMSCardMedia from "./components/common/card/PPMS-card-media";
import PPMSCardGroup from "./components/common/card/PPMS-card-group";

export interface Props {}

export interface State {}

export default class CardExample extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }
  render() {
    return <>{cardExamples()}</>;
  }
}
const card = (
  <PPMSCard>
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Card</h2>
    </PPMSCardHeader>
    <PPMSCardBody>
      <p> This is a standard card with a button in the footer. </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const cardWithMedia = (
  <PPMSCard>
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Card With Media</h2>
    </PPMSCardHeader>
    <PPMSCardMedia>
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody>
      <p> This is a standard card with media and a button in the footer. </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const mediaWithSetAspectRatio = (
  <PPMSCard>
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Media with Set Aspect Ratio</h2>
    </PPMSCardHeader>
    <PPMSCardMedia imageClass="add-aspect-3x1">
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody>
      <p>
        This is a standard card with media at a set aspect ratio of 3X1 and a
        button in the footer.
      </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const mediaAndHeaderFirst = (
  <PPMSCard headerFirst>
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Media and Header First</h2>
    </PPMSCardHeader>
    <PPMSCardMedia>
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody>
      <p>
        This is a standard card with the header and media first and a button in
        the footer.
      </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const insetMedia = (
  <PPMSCard headerFirst>
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Inset Media</h2>
    </PPMSCardHeader>
    <PPMSCardMedia inset>
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody>
      <p>
        This is a standard card with the header and media first, inset media,
        and a button in the footer.
      </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const exdentMedia = (
  <PPMSCard headerFirst>
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Exdent Media</h2>
    </PPMSCardHeader>
    <PPMSCardMedia exdent>
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody>
      <p>
        This is a standard card with the header and media first, exdent media,
        and a button in the footer.
      </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const exdentCard = (
  <PPMSCard headerFirst>
    <PPMSCardHeader exdent>
      <h2 className="usa-card__heading">Exdent Card</h2>
    </PPMSCardHeader>
    <PPMSCardMedia exdent>
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody exdent>
      <p>
        This is a standard card with the header and media first, media, and a
        button in the footer. All of which are exdent style.
      </p>
    </PPMSCardBody>
    <PPMSCardFooter exdent>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const flagDefault = (
  <PPMSCard layout="flagDefault">
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Flag standardDefault</h2>
    </PPMSCardHeader>
    <PPMSCardMedia>
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody>
      <p> This is a flag card with a button in the footer. </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

const flagMediaOnRight = (
  <PPMSCard layout="flagMediaRight" headerFirst>
    <PPMSCardHeader>
      <h2 className="usa-card__heading">Flag Media on Right</h2>
    </PPMSCardHeader>
    <PPMSCardMedia>
      <img
        src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg"
        alt="A placeholder"
      />
    </PPMSCardMedia>
    <PPMSCardBody>
      <p>
        This is a flag card with media on the right and a button in the footer.
      </p>
    </PPMSCardBody>
    <PPMSCardFooter>
      <PPMSButton
        id={"button"}
        type="button"
        className="usa-button"
        label={"Example Button"}
      />
    </PPMSCardFooter>
  </PPMSCard>
);

export const cardExamples = (): React.ReactElement => (
  <>
    <PPMSCardGroup>{[flagDefault, flagMediaOnRight]}</PPMSCardGroup>
    <PPMSCardGroup>
      {[
        card,
        cardWithMedia,
        mediaWithSetAspectRatio,
        mediaAndHeaderFirst,
        insetMedia,
        exdentMedia,
        exdentCard,
      ]}
    </PPMSCardGroup>
  </>
);
