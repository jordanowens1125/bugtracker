import { ResponsivePie } from "@nivo/pie";
// console.log(AnyChart);
const PieChart = ({ data, header }) => {
  return (
    <div className="chart-container">
      <i className="chart-header">{header}</i>
      <div className="chart full-width">
        <ResponsivePie
          data={data}
          margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
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
        />
      </div>
    </div>
  );
};

export default PieChart;
