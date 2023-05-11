import {store} from '../redux/store'
import { setMessage } from '../redux/actions/messageActions';
import api from '../api';
import { setProjects } from '../redux/actions/projectActions';
import { setUsers } from '../redux/actions/userActions';

const dispatch = store.dispatch
const users = store.getState().allUsers.users;
const projects = store.getState().allProjects.projects;


const validateProject = () => {

}

export const createProject = async(project) => {
    //const validated = validateProject(project)
    const validated = true
    if (validated) {
        const newProject = await api.projects.createProject(project)
        //populate new Project members
        const {populatedProject, updatedMembers} = populateNewProjectMembers(newProject)
        const updatedProjects = [...projects, populatedProject]
        dispatch(
          setMessage(
            `Project ${populatedProject.title} has been successfully created`
          )
        );
        return { newProjects: updatedProjects, newMembers: updatedMembers }
    }
    else {
        
    }
}

const populateNewProjectMembers = (newProject) => {
    const populatedProject = { ...newProject }
    const newUsers = structuredClone(users)
    let usersInProject = []
    
    for (let i = 0; i < newUsers.length; i++){
        if (populatedProject.members.includes(newUsers[i]._id)) {
            
            //deliberately want to add new project instead of populated project
            newUsers[i].project = [populatedProject]
            newUsers[i].assigned = true
            usersInProject.push(newUsers[i]);
        }
    }
    populatedProject.members = usersInProject
    return { populatedProject, newUsers }
}

const addUsersToNewProject = (project) => {
    
}

const addUserToProject = (project, user) => {
    const copyUser = { ...user }
    copyUser.project = [project];
    
    const updatedUsers = [...users]
    //update user
    for (let i =0 ; i < updatedUsers.length; i++) {
        if (updatedUsers[i]._id === copyUser._id) {
          copyUser.assigned = true
          updatedUsers[i] = copyUser;
          dispatch(setUsers(updatedUsers))
            console.log(updatedUsers);
          break; //Stop this loop, we found it!
      }
    }
}

const removeAllUsersFromProject = (project) => {

}