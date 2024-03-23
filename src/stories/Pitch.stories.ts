import type { Meta, StoryObj } from "@storybook/react";

import Pitch from "../Pitch";
import { baseProps } from '../testData'

const meta = {
  title: "react-football-formation/Pitch",
  component: Pitch,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Pitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sample: Story = {
  args: baseProps,
};
