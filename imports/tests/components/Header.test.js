import React from "react";
import { shallow } from "enzyme";
import { Header } from "./../../ui/components/Header";

test("should render Header correctly", () => {
  const handleNavToggle = jest.fn();
  const wrapper = shallow(
    <Header handleNavToggle={handleNavToggle} isNavOpen={false} />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should call handleNavToggle on toogle click", () => {
  const handleNavToggleSpy = jest.fn();
  const wrapper = shallow(
    <Header handleNavToggle={handleNavToggleSpy} isNavOpen={false} />
  );
  wrapper.find(".top-header__nav-toogle").simulate("click");
  expect(handleNavToggleSpy).toHaveBeenCalled();
});
