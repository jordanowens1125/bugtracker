import { ResponsiveBar } from "@nivo/bar";

const colors = ["#7f55da", "#4d4599", "#5594da", "#9555da", "#3c6899"];

const BarChart = ({ data, column, title }) => {
  let coloredData = data.map((column, index) => ({
    ...column,
    color: colors[index],
  }));

  const getBarColor = (bar) => bar.data.color;
  return (
    <>
      <div className="chart-container">
        <i className="chart-header">{title}</i>
        <div className="chart full-width">
          <ResponsiveBar
            data={coloredData}
            keys={["value"]}
            indexBy={column}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            padding={0.05}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={getBarColor}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            tooltip={() => {}}
            role="application"
            isFocusable={false}
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={(e) => e.id + ": " + e.role + e.indexValue}
          />
        </div>
      </div>
    </>
  );
};

export default BarChart;
