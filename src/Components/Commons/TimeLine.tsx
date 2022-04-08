import * as React from "react";
import { If, Then } from "react-if";
import styled from "styled-components/native";

import { AppText } from "./AppStyledComponents";

export const Row = styled.View`
  height: auto;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: flex-start;
  align-items: flex-start;
`;
export const RowCenter = styled.View`
  justify-content: flex-start;
  align-items: center;
`;
export const Dot = styled.View`
  height: 15px;
  width: 15px;
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 50;
  margin-top: -1px;
  z-index: 1;
`;
export const HalfVerticalLine = styled.View`
  height: 35px;
  width: 5px;
  background-color: ${({ bgColor }) => bgColor};
  margin-top: -1px;
`;
export const Content = styled.View`
  padding-left: 10px;
  margin-left: 10px;
  margin-top: -1px;
  height: 82.5px;
`;

export const LastRowWrapper = styled.View`
  margin-top: -26px;
  padding-left: 10px;
  margin-left: 10px;
  height: 45px;
  display: flex;
  justify-content: flex-end;
`;

const LastRowText = styled(AppText)`
  font-size: 17;
  color: #80838c;
  flex-shrink: 1;
`;

const RowText = styled(AppText)`
  font-size: 17;
  color: #80838c;
`;
const defaultColors = { active: "#2DA920", defaultColor: "#D1D4DC" };

type getColorsPerPointReturnType = {
  dotColor: string;
  topLineColor: string;
  bottomLineColor: string;
};
type getColorsPerPointParams = { fillPoint: number; currentIndex: number; colors: { active: string; defaultColor: string } };
type getColorsPerPointCallback = (args: getColorsPerPointParams) => getColorsPerPointReturnType;
type TimeLineProps = {
  fillPoint: number;
  colors?: Partial<typeof defaultColors>;
  data: any[];
};
type VerticalTimeLineProps = Omit<TimeLineProps, "data" | "colors"> & {
  points: any[];
  colors: typeof defaultColors;
};

const getColorsPerPoint: getColorsPerPointCallback = ({ fillPoint, currentIndex, colors: { active, defaultColor } }) => {
  let dotColor = defaultColor,
    topLineColor = defaultColor,
    bottomLineColor = defaultColor;

  const floorPoint = Math.floor(fillPoint);
  if (currentIndex <= floorPoint) {
    dotColor = active;
    topLineColor = currentIndex + 0.5 <= fillPoint ? active : defaultColor;
    bottomLineColor = currentIndex < floorPoint ? active : defaultColor;
  }

  return { dotColor, topLineColor, bottomLineColor };
};
const VerticalLine = ({ dotColor, topLineColor, bottomLineColor, lastItem = false }) => {
  return (
    <Row flexDirection="column" style={{ alignItems: "center" }}>
      <Dot bgColor={dotColor} />
      <If condition={!lastItem}>
        <Then>
          <HalfVerticalLine bgColor={topLineColor} />
          <HalfVerticalLine bgColor={bottomLineColor} />
        </Then>
      </If>
    </Row>
  );
};

export const VerticalTimelineBar: React.FC<VerticalTimeLineProps> = ({ points, fillPoint, colors }) => {
  return (
    <Row flexDirection="column">
      {points.map((_, key) => {
        const verticalLineProps = getColorsPerPoint({ fillPoint, currentIndex: key, colors });
        if (key === points.length - 1) return <VerticalLine {...verticalLineProps} lastItem />;
        return <VerticalLine {...verticalLineProps} />;
      })}
    </Row>
  );
};

export const TimeLine: React.FC<TimeLineProps> = ({ fillPoint, colors = defaultColors, data }) => {
  const updatedColors = { ...defaultColors, ...colors };
  return (
    <Row flexDirection="row">
      <VerticalTimelineBar points={data} colors={updatedColors} fillPoint={fillPoint} />
      <Row flexDirection="column" style={{ marginTop: -2 }}>
        {data.map((item, key) => {
          if (key === data.length - 1)
            return (
              <LastRowWrapper>
                <LastRowText>{item.description}</LastRowText>
              </LastRowWrapper>
            );
          return (
            <RowCenter>
              <Content>
                <RowText>{item.description}</RowText>
              </Content>
            </RowCenter>
          );
        })}
      </Row>
    </Row>
  );
};
