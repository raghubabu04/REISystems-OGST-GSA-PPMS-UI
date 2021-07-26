import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import PPMSAccordion from "./components/common/accordion/PPMS-accordion";
import { PPMSBreadcrumb } from "./components/common/breadcrumbs/PPMS-breadcrumb";
import PPMSComboBox from "./components/common/combo-box/PPMS-combo-box";
import { PPMSStepIndicator } from "./components/common/step-indicator/PPMS-step-indicator";
import PPMSSummaryBox from "./components/common/summary-box/PPMS-summary-box";
import PPMSProcessList from "./components/common/process-list/PPMS-process-list";
import PPMSDatePickerV2 from "./components/common/datepicker-v2/PPMS-date-picker-v2";

interface State {
  defaultCardKey: number;
  startDate?: string;
  endDate?: string;
}

interface Props {
  match: any;
  location: any;
  history: any;
  context: any;
}

export class Accordion extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      defaultCardKey: 1,
      startDate: "2021-01-20",
      endDate: "2021-01-08",
    };
    this.onClick = this.onClick.bind(this);
    this.updateZip = this.updateZip.bind(this);
    this.updateZipExtension = this.updateZipExtension.bind(this);
    this.onFSCRemove = this.onFSCRemove.bind(this);
    this.onFSCSelect = this.onFSCSelect.bind(this);
  }

  onClick = (key) => {
    console.log(key);
  };
  updateDate = (date) => {
    console.log(date);
  };
  updateZip(event) {
    console.log(event);
  }
  updateZipExtension(event) {
    console.log(event);
  }
  onFSCRemove(event) {
    console.log(event);
  }
  onFSCSelect(event) {
    console.log(event);
  }
  values = [
    { key: "Option 1", cat: "Group 1" },
    { key: "Option 2", cat: "Group 1" },
    { key: "Option 3", cat: "Group 1" },
    { key: "Option 4", cat: "Group 2" },
    { key: "Option 5", cat: "Group 2" },
    { key: "Option 6", cat: "Group 2" },
    { key: "Option 7", cat: "Group 2" },
  ];
  combo = {
    apple: "Apple",
    apricot: "Apricot",
    avocado: "Avocado",
    banana: "Banana",
  };
  comboList = Object.entries(this.combo).map(([value, key]) => ({
    value: value,
    label: key,
  }));
  items = [
    {
      id: "breadcrumb-home",
      href: "/",
      label: "Home",
      active: false,
    },
    {
      id: "breadcrumb-sample",
      href: "/sample",
      label: "Sample",
      active: false,
    },
    {
      id: "breadcrumb-accordion",
      href: "#",
      label: "Accordion",
      active: true,
    },
  ];
  changeStartDate = (date) => {
    this.setState({ startDate: date });
  };
  changeEndDate = (date) => {
    this.setState({ endDate: date });
  };
  render() {
    const customTestItems = [
      {
        title: (
          <div className={"accordion-custom"}>
            Title text{" "}
            <span className={"infected"}>
              <FaInfoCircle />
            </span>
          </div>
        ),
        content: (
          <p>
            Congress shall make no law respecting an establishment of religion,
            or prohibiting the free exercise thereof; or abridging the freedom
            of speech, or of the press; or the right of the people peaceably to
            assemble, and to petition the Government for a redress of
            grievances.
          </p>
        ),
        expanded: false,
        id: "123",
        className: "myCustomAccordionItem",
      },
      {
        title: "Second Amendment",
        content: (
          <>
            <p>
              A well regulated Militia, being necessary to the security of a
              free State, the right of the people to keep and bear Arms, shall
              not be infringed.
            </p>{" "}
            <ul>
              <li>This is a list item</li>
              <li>Another list item</li>
            </ul>
          </>
        ),
        expanded: false,
        id: "abc",
      },
      {
        title: "Third Amendment",
        content: (
          <p>
            No Soldier shall, in time of peace be quartered in any house,
            without the consent of the Owner, nor in time of war, but in a
            manner to be prescribed by law.
          </p>
        ),
        expanded: false,
        id: "def",
      },
    ];
    const content = [
      'If you are under a winter storm warning, <a href="#usa-anchor-find-shelter">find shelter</a> right away.',
      'Sign up for <a href="#usa-anchor-warning-system">your community’s warning system</a>.',
      'Learn the signs of, and basic treatments for, <a href="#usa-anchor-frostbite">frostbite</a> and <a href="#usa-anchor-hypothermia">hypothermia</a>.',
      'Gather emergency supplies for your <a href="#usa-anchor-home">home</a> and your <a href="#usa-anchor-car">car</a>.',
    ];
    const processList = [
      {
        header: "Start a process",
        content:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque. <ul><li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis.</li><li>Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum.</li><li>Aliquam erat volutpat. Sed quis velit.</li></ul>",
      },
      {
        header: "Proceed to the second step",
        content:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida, orci magna rhoncus neque, id pulvinar odio lorem non turpis. Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit. Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien.",
      },
      {
        header: "Complete the step-by-step process",
        content:
          "Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit. Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien.",
      },
    ];
    return (
      <>
        <div className={"grid-container"}>
          <PPMSBreadcrumb items={this.items} />
          <PPMSAccordion bordered={true} items={customTestItems} />
          <PPMSComboBox
            id="combo-box"
            name="combo"
            options={this.comboList}
            onChange={() => {
              console.log("Combo Check");
            }}
            disabled={false}
          />
          <br />
          <div className={"grid-row"}>
            <div className={"grid-col-4"}>
              <PPMSDatePickerV2
                id="birthdate"
                name="birthdate"
                isInvalid={false}
                label={"Appointment Date"}
                validationMessage={"Message"}
              />
            </div>
          </div>
          <br />
          <div className={"grid-row flex-wrap"}>
            <div className="usa-date-range-picker">
              <div className={"grid-flex"}>
                <PPMSDatePickerV2
                  id="event-date-start"
                  name="event-date-start"
                  isInvalid={false}
                  label={"Start Date"}
                  defaultValue={this.state.startDate}
                  rangeDate={this.state.endDate}
                  validationMessage={"Message"}
                />
                <PPMSDatePickerV2
                  id="event-end-date"
                  name="event-end-date"
                  isInvalid={false}
                  label={"End Date"}
                  defaultValue={this.state.startDate}
                  rangeDate={this.state.endDate}
                  validationMessage={"Message"}
                />
              </div>
            </div>
          </div>
          <br />
          <div className={"grid-row"}>
            <PPMSStepIndicator
              id={"step-indicator"}
              type={"small-counters"}
              showExtras={true}
              steps={[
                { label: "Personal Information" },
                { label: "Household Status" },
                { label: "Supporting Documents", current: true },
                { label: "Signature" },
                { label: "Review and Submit" },
              ]}
            />
          </div>
          <br />
          <div className={"grid-row"}>
            <PPMSSummaryBox
              id={"summary-box"}
              heading={"Key information"}
              content={content}
            />
          </div>
          <br />
          <div className={"grid-row"}>
            <PPMSProcessList
              id={"summary-box"}
              list={processList}
              noText={false}
              lightText={true}
              size={"x1"}
            />
          </div>
        </div>
      </>
    );
  }
}
