import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import api from "../../api/index";

const TicketsByProject = ({ data /* see data tab */ }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.9}
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

const AdminDashboard = () => {
  const [bugsByProject, setBugsByProject] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [dev, setDev] = useState([]);
  const [bugs, setBugs] = useState([]);

  const byDevs = (bugs) => {
    const devs = {};
    const result = [];
    bugs.map((bug) => {
      if (devs[bug.assignedTo]) {
        devs[bug.assignedTo] += 1;
        return bug;
      } else {
        devs[bug.assignedTo] = 1;
        return 1;
      }
    });
    Object.keys(devs).map((dev) =>
      result.push({
        id: dev,
        label: dev,
        value: devs[dev],
      })
    );
    console.log(result);
    setDev(result);
  };

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
      setBugs(request);
      groupedByProjects(request);
      byPriority(request);
      byStatus(request);
      byDevs(request)
    };
    fetchBug();
  }, []);

  return (
    <>
      <div className="page">
        <h1>Welcome username</h1>
        <a href="/createproject" aria-label="Open create project form">
          {" "}
          Create Project
        </a>
        <h2>Tickets: {bugs.length}</h2>
        <div className="flex mobile-column">
          <div className="chart">
            <TicketsByProject data={bugsByProject} />
          </div>
          <div className="chart">
            <TicketsByProject data={priority} />
          </div>
          <div className="chart">
            <TicketsByProject data={status} />
          </div>
          <div className="chart">
            <TicketsByProject data={dev} />
          </div>
        </div>
        tickets projects Schedule
      </div>
    </>
  );
};

export default AdminDashboard;
