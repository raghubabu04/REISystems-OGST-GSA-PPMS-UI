import React, { Component } from "react";
import { loadModules } from "esri-loader";

export class MapLoader extends Component {
  static load(modules: any[], options?: any): Promise<any[]> {
    return loadModules(modules, options);
  }
}
