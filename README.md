# FCS-Backend

## 1. Project Guidelines

### 1.1 Project Structure 
The project follow standard `express` framework structure. Following is a brief of directories and content. 

    .
    ├── app                     # Application files , mainly contain MVC, helper and utils files
    ├── config                  # Environment Configration and string constants used in project
    ├── public                  # Admin portal files
    ├── scripts                 # independent code the can run in background to support main code 
    ├── LICENSE
    └── README.md
 
### 1.2 File naming 
#### 1.2.1 Modules File
##### 1.2.1.1 Routes files
<module_name>.server.routes.js 

example : `users.server.routes.js`

##### 1.2.1.2 Controller File 
<module_name>.server.controller.js

##### 1.2.1.3 models file
<module_name>.server.model.js

#### 1.2.2 Raw files 
<underscore_seperated_lowercase_name>.json

### 1.2 Code Style Guidelines 
#### 1.2.1 Use Async/Await or Promises. Avoid callbacks.

Don't use callback till its the last resort. 
