import { ResponsivePie } from "@nivo/pie";
// console.log(AnyChart);
const PieChart = ({ data, header }) => {
  return (
    <div className="chart-container mobile-full-width">
      <i className="chart-header">{header}</i>
      <div className="chart full-width">
        <ResponsivePie
          data={data}
          margin={{ top: 30, right: 10, bottom: 30, left: 10 }}
          innerRadius={0.6}
          padAngle={4}
          cornerRadius={1.5}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="inherit"
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
              color: "inherit",
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
