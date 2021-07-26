import React, { useEffect, useState } from "react";
import { PPMSInput } from "./common/input/PPMS-input";
import { PPMSButton } from "./common/PPMS-button";
import { FiPlus } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { sanitizeUrl } from "../utilities/FormatUtil";

interface PPMSURLLinksProps {
  label?: string;
  nameLabel?: string;
  urlLabel?: string;
  removeLabel?: string;
  addLabel?: string;
  labelBold?: boolean;
  maxLinks?: number;
  minLinks?: number;
  links?: { name: string; url: string }[];
  updateLinks?: (values: any[]) => void;
  disable?: boolean;
}

const PPMSURLLinks = (props: PPMSURLLinksProps) => {
  const {
    nameLabel,
    urlLabel,
    removeLabel,
    addLabel,
    labelBold,
    maxLinks,
    minLinks,
    links,
    updateLinks,
    disable,
  } = props;
  const [fields, setFields] = useState(getFields(links, minLinks));
  useEffect(() => {
    setFields(getFields(links, minLinks));
  }, [links]);

  function getFields(links, minLinks) {
    if (links && links.length > 0) {
      return links;
    } else if (minLinks) {
      let fieldArray = [];
      for (let i = 0; i < minLinks; i++) {
        fieldArray.push({ name: null, url: null });
      }
      return fieldArray;
    } else {
      return [{ name: null, url: null }];
    }
  }
  function handleNameChange(i, event) {
    const values = [...fields];
    values[i].name = event.target.value;
    setFields(values);
    updateLinks(values);
  }
  function handleURLChange(i, event) {
    const values = [...fields];
    values[i].url = sanitizeUrl(event.target.value);
    setFields(values);
    updateLinks(values);
  }

  function handleAdd() {
    const values = [...fields];
    values.push({ name: null, url: null });
    setFields(values);
    updateLinks(values);
  }

  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    if (minLinks && values.length < minLinks) {
      for (let i = 0; i < minLinks - values.length; i++) {
        values.push({ name: null, url: null });
      }
    } else if (values.length === 0) {
      values.push({ name: null, url: null });
    }
    setFields(values);
    updateLinks(values);
  }
  return (
    <>
      {fields.map((field, index) => {
        return (
          <div key={`${field}-${index}`} className={"grid-row grid-gap-2"}>
            <div className={"grid-col-5"}>
              <PPMSInput
                id={`url-name-${index}`}
                label={nameLabel || "Name"}
                labelBold={labelBold}
                inputType={"text"}
                isDisabled={disable}
                isRequired={false}
                value={field?.name || ""}
                maxLength={60}
                onChange={(event) => handleNameChange(index, event)}
              />
            </div>
            <div className={"grid-col-5"}>
              <PPMSInput
                id={`url-link-${index}`}
                label={urlLabel || "URL"}
                labelBold={labelBold}
                inputType={"text"}
                isDisabled={disable}
                isRequired={false}
                maxLength={125}
                value={field?.url || ""}
                onChange={(event) => handleURLChange(index, event)}
              />
            </div>
            <div className={"grid-col-2 flex-align-self-end"}>
              <PPMSButton
                id={`url-remove-${index}`}
                type={"button"}
                label={removeLabel || ""}
                icon={<FaTrashAlt />}
                onPress={() => handleRemove(index)}
                isDisabled={disable}
              />
            </div>
          </div>
        );
      })}
      <br />
      <div className={"grid-row grid-gap-2"}>
        <div className={"grid-col"}>
          <PPMSButton
            id={`url-add`}
            type={"button"}
            label={addLabel || ""}
            size={"sm"}
            icon={<FiPlus />}
            isDisabled={disable?disable:(maxLinks && fields.length >= maxLinks) || false}
            onPress={() => handleAdd()}
          />
        </div>
      </div>
    </>
  );
};

export default PPMSURLLinks;
