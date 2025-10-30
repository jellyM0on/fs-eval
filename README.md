## New Implementation
- Added UsersController 
  - Login
  - Register
  - Get User By Id
- Refactored TasksController routes
- Added DTOs so only necessary fields are exposed depending on the route
- Added CORS configs
- Added pages
  - Login/Registration
  - Tasks
- Added minimal styling with inline css

## Out of Scope
- Security. Only demo authentication implemented
- Additional frontend features
- Responsiveness

### How to start
- Start backend
  - `cd ./backend`
  - `dotnet restore`
  - Export DB credentials. 
    - Can edit appsettings.json or `export ConnectionStrings__DefaultConnection="Host=localhost;Database=taskmanager;Username=<name>;Password=<pass>"` (Bash) or `$env:ConnectionStrings__DefaultConnection = "Host=localhost;Database=taskmanager;Username=<name>;Password=<pass>"` (Powershell)
  - `dotnet ef database update`
  - `dotnet run`
- Start frontend
  - `cd ../frontend`
  - In an .env file, supply:
    - `VITE_API_BASE_URL=http://localhost:5215`. URL should match your server
  - `npm install`. Run `npm audit fix` if there are errors
  - `npm run dev`

### Demo

https://github.com/user-attachments/assets/e21e157d-3f46-466a-8a4d-681059180f46

