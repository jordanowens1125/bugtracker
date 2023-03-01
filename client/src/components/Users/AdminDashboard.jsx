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
      width: 300,
      headAlign: "left",
      align: "left",
      renderCell: (params) => {
        return (
          <Button
            aria-label="Go to project page"
            variant="contained"
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
              aria-label="Delete this project"
              variant="outlined"
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
      <Box
        sx={{
          height: 600,
          maxWidth: '100%',
          paddingBottom: 10,
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <DataGrid
          rows={projects}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={8}
          getEstimatedRowHeight={() => 200}
          rowsPerPageOptions={[8]}
          //onRowClick={navigateToProject}
          experimentalFeatures={{ newEditingApi: true }}
          components={{ Toolbar: ProjectDataGridTitle }}
          sx={{ maxWidth: 1400 }}
        />
      </Box>
    </>
  );
};

export default AdminDashboard;
