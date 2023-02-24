import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CreateProjectModal from "../Projects/CreateProjectModal/CreateProjectModal";
import { useNavigate } from "react-router-dom";
import { removeSelectedBug, setBugs } from "../../redux/actions/bugActions";
import { removeComments } from "../../redux/actions/commentActions";
import api from "../../api/index";
import { setUsers } from "../../redux/actions/userActions";
import { setProjects } from "../../redux/actions/projectActions";
import { setMessage } from "../../redux/actions/messageActions";

function ProjectDataGridTitle() {
  return (
    <Box
      style={{
        marginLeft: "2%",
        marginTop: "2%",
        width: "95%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6">Projects</Typography>
      <CreateProjectModal />
    </Box>
  );
}

const AdminDashboard = () => {
  const projects = useSelector((state) => state.allProjects.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateToProject = (e, row) => {
    dispatch(removeSelectedBug());
    dispatch(removeComments());
    navigate(`/projects/${row._id}`);
  };
  //const [projectToDelete, setProjectToDelete] = useState({})
  //project confirm delete popup info
  const handleDeleteClick = async (e, row) => {
    await api.projects.deleteProject(row);
    dispatch(setMessage(`Project was successfully deleted!`));
    const { bugs, projects, users } = await api.aggregate.getAll();
    dispatch(setBugs(bugs));
    dispatch(setProjects(projects));
    dispatch(setUsers(users));
  };
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 250,
      headAlign: "left",
      align: "left",
      renderCell: (params) => {
        return (
          <Button
            key={params.id}
            onClick={(e) => navigateToProject(e, params.row)}
          >
            {params.row.title}
          </Button>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 450,
      headerAlign: "left",
      align: "left",
      editable: true,
    },
    {
      field: "bug",
      headerName: "Bugs",
      width: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const bugs = params.row.bugs;
        return <>{bugs.length}</>;
      },
    },
    {
      field: "Contributors",
      headerName: "Contributors",
      width: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const members = params.row.members;
        return <>{members.length}</>;
      },
    },
    {
      field: "Delete",
      headerName: "",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => handleDeleteClick(e, params.row)}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Box sx={{ height: 425, width: "100%", paddingBottom: 10 }}>
        <DataGrid
          rows={projects}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={5}
          getEstimatedRowHeight={() => 200}
          rowsPerPageOptions={[5]}
          //onRowClick={navigateToProject}
          experimentalFeatures={{ newEditingApi: true }}
          components={{ Toolbar: ProjectDataGridTitle }}
        />
      </Box>
    </>
  );
};

export default AdminDashboard;
