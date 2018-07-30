import ReactShallowRenderer from "react-test-renderer/shallow";
import SideBar from "./../../imports/ui/components/SideBar";

test("should render Header correctly", () => {
  const renderer = new ReactShallowRenderer();

  renderer.render(SideBar);
  console.log(renderer.getRenderOutput());
});
