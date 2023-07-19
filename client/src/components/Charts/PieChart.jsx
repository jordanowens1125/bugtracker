import { ResponsivePie } from "@nivo/pie";
// console.log(AnyChart);
const PieChart = ({ data, header }) => {
  const el = document.querySelectorAll(".light-mode, .dark-mode")[0];
  const fontColor = el
    ? getComputedStyle(el)?.getPropertyValue("--font-color")
    : "#000";
  return (
    <div className="chart-container mobile-full-width">
      <i className="chart-header">{header}</i>
      <div className="chart full-width primary">
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
          arcLinkLabelsTextColor={fontColor}
          arcLinkLabelsThickness={2}
          arcLinkLabelsStraightLength={9}
          arcLinkLabelsDiagonalLength={9}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={20}
          arcLabelsTextColor={"#fff"}
          tooltip={(data) => (
            <div className="primary p-sm white-bg b-radius-sm">
              {`${data.datum.label} `} : {data.datum.value}
            </div>
          )}
          labelTextColor="#6e62e5"
          colors={["#7f55da", "#4d4599", "#5594da", "#9555da", "#3c6899"]}
        />
      </div>
    </div>
  );
};

export default PieChart;
