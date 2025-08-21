import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ReflexiveBundle from "../ReflexiveBundle";

describe("ReflexiveBundle Language System", () => {
  test("renders without crashing", () => {
    const { container } = render(<ReflexiveBundle loopCode="MES-L10" screen="learning" />);
    expect(container).toBeTruthy();
  });

  test("renders default screen", () => {
    const { getByText } = render(<ReflexiveBundle loopCode="MES-L10" />);
    expect(getByText(/MES-L10/i)).toBeInTheDocument();
  });
});