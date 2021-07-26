import { configure, shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-canvas-mock";

configure({ adapter: new Adapter() });

(global as any).shallow = shallow;
(global as any).render = render;
(global as any).mount = mount;
