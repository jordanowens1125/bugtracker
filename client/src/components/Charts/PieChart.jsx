import React from 'react'
import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ data  }) => {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 80, right: 50, bottom: 80, left: 50 }}
      innerRadius={0.65}
      padAngle={4}
      cornerRadius={1.5}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsStraightLength={9}
      arcLinkLabelsDiagonalLength={9}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={20}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      colors={["#7f55da", "#4d4599", "#5594da", "#9555da", "#3c6899"]}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart