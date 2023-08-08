# Issue Tracker App
This project is a task manager app that enables user roles, CRUD - Create, Read, Update, Delete functionality to projects, tickets, and users.

**Link to project:** https://bugtracker-frontend-2zlk.onrender.com

https://github.com/jordanowens1125/bugtracker/assets/60613533/dcbedfee-84c3-4a51-bb0c-2bd10620e7db


## How It's Made:

**Tech used:** HTML, CSS, JavaScript, React, Express, Nivo Pie and Bar Chart, JWT, MongoDB

This application is centered around projects, which can have a variety of tickets/tasks. Admin and project managers are gifted the ability to update and edit these projects and their respective tasks as they see fit. This includes assigning and unassigning users to a given project. 

By utilizing react context, users can be given access to certain pages depending on their role and if they are signed in or not. Upon app load, unsigned users are directed to the login page. They can also navigate from the login page to the demo sign-in page. Once, signed in users are navigated to the home page, and their info is stored in their local storage.  

## Functionality 

**Project Manager**

Project managers are shown tasks as it pertains to their assigned project on their dashboard. Project managers are able to create new tasks and projects. Project managers can also manage the members of a given project by adding and removing members from a project.

**Admin** 

Admins are shown all task data across the application within their dashboard. The abilities of the admin include that of the project manager while also including user management. This includes changing user roles and adding and deleting users. 

**Developer** 

Developers are shown the tasks assigned to them and are able to make comments on those tasks.

## Lesson Learned

By working on this project I was able to get very comfortable with setting up a backend. I was also able to implement JWT to ensure that only authorized users could receive data for specific api requests.
