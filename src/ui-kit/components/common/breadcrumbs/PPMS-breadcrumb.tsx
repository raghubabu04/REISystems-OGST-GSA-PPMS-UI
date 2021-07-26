import React from "react";
import { Link } from "react-router-dom";

export interface PPMSBreadcrumbProps {
  items: any[];
}
export interface PPMSBreadcrumbState {}
export class PPMSBreadcrumb extends React.Component<
  PPMSBreadcrumbProps,
  PPMSBreadcrumbState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const items = this.props.items.map((item: any, index) => (
      <li
        key={`crumb-${index}`}
        className={`usa-breadcrumb__list-item ${
          item.active ? "usa-current" : ""
        }`}
        aria-current={item.active}
      >
        {!item.active && (
          <Link to={item.href} className="usa-breadcrumb__link">
            <span>{item.label}</span>
          </Link>
        )}
        {item.active && <span>{item.label}</span>}
      </li>
    ));
    return (
      <nav
        className="usa-breadcrumb usa-breadcrumb--wrap"
        aria-label="PPDMS Breadcrumbs"
      >
        <ol className="usa-breadcrumb__list">{items}</ol>
      </nav>
    );
  }
}
