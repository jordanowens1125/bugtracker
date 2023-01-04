import React from 'react';
import CreateProjectModal from '../components/Projects/CreateProjectModal/CreateProjectModal';
import ProjectsTable from '../components/Projects/ProjectsTable/ProjectsTable'
const Projects = () => {
  return (
    <>
      <h1>Projects</h1>
      <CreateProjectModal/>
      <ProjectsTable />
    </>
  )
};
  
export default Projects;