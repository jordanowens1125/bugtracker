import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import api from "../../api/index";

const TicketsByProject = ({ data /* see data tab */ }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.2]],
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
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
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
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

const AdminDashboard = () => {
  const [bugsByProject, setBugsByProject] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const groupedByProjects = (bugs) => {
    const projects = {};
    const result = [];
    bugs.map((bug) => {
      if (projects[bug.projectID.title]) {
        projects[bug.projectID.title] += 1;
        return bug;
      } else {
        projects[bug.projectID.title] = 1;
        return 1;
      }
    });
    Object.keys(projects).map((project) =>
      result.push({
        id: project,
        label: project,
        value: projects[project],
      })
    );
    setBugsByProject(result);
  };

  const byPriority = (bugs) => {
    const projects = {};
    const result = [];
    bugs.map((bug) => {
      if (projects[bug.priority]) {
        projects[bug.priority] += 1;
        return bug;
      } else {
        projects[bug.priority] = 1;
        return 1;
      }
    });
    Object.keys(projects).map((project) =>
      result.push({
        id: project,
        label: project,
        value: projects[project],
      })
    );
    setPriority(result);
  };

  const byStatus = (bugs) => {
    const projects = {};
    const result = [];
    bugs.map((bug) => {
      if (projects[bug.status]) {
        projects[bug.status] += 1;
        return bug;
      } else {
        projects[bug.status] = 1;
        return 1;
      }
    });
    Object.keys(projects).map((project) =>
      result.push({
        id: project,
        label: project,
        value: projects[project],
      })
    );
    setStatus(result);
  };

  useEffect(() => {
    const fetchBug = async () => {
      const request = await api.bugs.fetchBugs();
      groupedByProjects(request);
      byPriority(request);
      byStatus(request);
    };
    fetchBug();
  }, []);

  return (
    <>
      <div className="page border">
        <h1>Welcome username</h1>
        <a href="/createproject" aria-label="Open create project form">
          {" "}
          Create Project
        </a>
        <div className="h-lg w-lg">
          <TicketsByProject data={bugsByProject} />
        </div>
        <div className="h-lg w-lg">
          <TicketsByProject data={priority} />
        </div>
        <div className="h-lg w-lg">
          <TicketsByProject data={status} />
        </div>
        tickets projects Schedule
      </div>
    </>
  );
};

export default AdminDashboard;
