import { ResponsiveBar } from "@nivo/bar";

const colors = ["#7f55da", "#4d4599", "#5594da", "#9555da", "#3c6899"];

const BarChart = ({ data, column, title }) => {
  let coloredData = data.map((column, index) => ({
    ...column,
    color: colors[index],
  }));

  const theme = {
    axis: {
      textColor :'inherit'
    },
  };

  return (
    <>
      <div className="chart-container">
        <i className="chart-header">{title}</i>
        <div className="chart full-width primary">
          <ResponsiveBar
            data={coloredData}
            keys={["value"]}
            indexBy={column}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            padding={0.05}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={colors}
            labelTextColor="#ffffff"
            theme={theme}
            role="application"
            isFocusable={false}
            tooltip={(data) => (
              <div className="primary">
                <b>
                  {`${data.indexValue} `} : {data.value}
                </b>
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default BarChart;
