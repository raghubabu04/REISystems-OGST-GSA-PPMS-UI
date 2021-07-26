import React from "react";
import classnames from "classnames";
import { FaSearch } from "react-icons/fa";
import { PPMSButton } from "../../PPMS-button";
import PPMSTextInput from '../../form/PPMS-text-input';

interface SearchInputProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputId?: string;
  inputName?: string;
  size?: "big" | "small";
  label?: React.ReactNode;
  className?: string;
}

export const PPMSHeaderSearch = (
  props: SearchInputProps
): React.ReactElement => {
  const {
    onSubmit,
    inputId = "search-field",
    inputName = "search",
    size,
    label = "PPMSHeaderSearch",
    className,
    ...formProps
  } = props;

  const isBig = size ? size === "big" : false;
  const isSmall = size ? size === "small" : false;
  const classes = classnames(
    "usa-search",
    {
      "usa-search--small": isSmall,
      "usa-search--big": isBig,
    },
    className
  );

  return (
    <form onSubmit={onSubmit} className={classes} role="search" {...formProps}>
      <PPMSTextInput
        id={inputId}
        type="search"
        name={inputName}
        placeholder={"Search"}
        autoComplete={"off"}
      />
      <PPMSButton
        type="submit"
        id={"header-search"}
        icon={<FaSearch />}
        label={""}
      />
    </form>
  );
};

export default PPMSHeaderSearch;
