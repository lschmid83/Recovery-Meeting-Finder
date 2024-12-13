# Recovery Meeting Finder

Thank you for taking an interest in www.recoverymeetingfinder.com

Recovery Meeting Finder is a 12-Step meeting finder and information website which I developed for Alcoholics Anonymous and other fellowships. It can be used to search for the nearest recovery meetings in the United Kingdom using the users location, town or postcode and displays the results on an interactive map.

This repository contains the source code for the Angular website and the data inserter project to import data dumps found at https://www.recoverymeetingfinder.com/meetings/data-dumps into a relational normalized SQL Server database. 

If you are a developer and want to rebuild the database, website and API in development mode these are the detailed instructions.

We are looking for contributors to the main project who could potentially add new features and ideas to the website. Please see the issue list for ideas.

If you have enough experience in web scraping, XPath and HTML Agility Pack and are interested in helping to maintain and test the web scrapers we use to collect meeting information then email admin@recoverymeetingfinder.com for information on our private repository.

This project was developed in Visual Studio 2022 using the C# and TypeScript languages and the following technologies:

* ASP.NET
* Entity Framework
* NetTopologySuite
* Web API
* Angular
* TypeScript
* Material UI
* Bootstrap
* JQuery
* HTML5
* CSS3 / SCSS
* Leaflet JS
* Open Street Maps
* Nominatim

Here are some screenshots of the website:

<img align='left' src='https://drive.google.com/uc?id=18bRzQllb0elTCDECR9HkTCZMSt0mAbSd' width='240'>
<img align='left' src='https://drive.google.com/uc?id=1RyZfyfbhBcONh7sHv6SJc_mVe3emAJrM' width='240'>
<img src='https://drive.google.com/uc?id=1GXGQwrMRzwgjbL8GIYRwpHFS5h3hbvVt' width='240'>

First make sure you have Visual Studio 2022, Node.js and SQL Server installed.

In this document $installPath will refer to the location of the repository source code. E.g. C:\source\repos\Recovery Meeting Finder

# Installing Angular

1) Download and install the Node.js from [here](https://drive.google.com/file/d/1Zw_KnE6yn6NXkbOijUxsAL-Gp45xZ4Gg/view?usp=sharing) or https://nodejs.org/en/download/current

2) Select Tools -> NuGet Package Manager -> Package Manager Console

3) Enter the command: 
   ```
   npm install -g @angular/cli@8.3.14
   ```

# Restoring Angular packages

1) Select Tools -> NuGet Package Manager -> Package Manager Console

2) Enter the command:
   ```
   cd $installPath\RMF.Website\ClientApp\
   ```

3) Enter the command:
   ```	
   npm install
   ```

   This will restore all of the Angular Node.js packages using the Node Package Manager.	

# Restoring NuGet packages

1) Select Tools -> NuGet Package Manager -> Package Manager Console

2) Enter the commands:
   ```
   Install-Package NuGet.CommandLine
   nuget restore RecoveryMeetingFinder.sln
   ```

# Database Context

You must define the connection string for the database. In the Solution explorer expand the RMF.DAL project and open the MeetingContext.cs file. In the OnCofiguring method you will find the connection string which should look like this:

`@"Data Source=YOUR_SERVER_NAME;Initial Catalog=RMF;Persist Security Info=True;User ID=YOUR_USERNAME;Password=YOUR_PASSWORD"`

Replace the data source, user id and password with your own database account credentials.

The database will be created and seeded automatically when you run the RMF.DataInserter project.

If you need to make changes to the database structure you can create a new migration script using the command from the Tools->NuGet Package Manage->Package Manager Console:

```
dotnet ef migrations add <migration name> -c RMF.DAL.MeetingContext
```

# Importing the Database Dump

When you checkout this project you will notice that there is a DataDump folder included with the solution folder

1) Open the RMF.DataInserter project in SolutionExplorer edit Program.cs.

2) Set the DataDumpPath const variable line.29 to the path of the database dump in your solution folder:   
   `$installPath\DataDump\`

3) Set the WebDataDumpPath const variable line.30 to the output path of the website project: 
   `$installPath\RMF.Website\wwwroot\data-dump\`

4) Set the DbBackupFilePath const variable line.34 to the output path of the database backup:
   `$installPath\DataDump\rmf.bak`

5) Right click on the 'C:\source\repos\Recovery Meeting Finder\DataDump\' folder in Windows Explorer. Select the Security Tab and click Edit... Add the user NT Service\MSSQLSERVER with Write permissions so the SQL Server instance can create the .bak file in the specified folder.

6) Run the RMF.DataInserter project and it will create and seed the database.

# Configuring the Web API

1) In the Solution explorer expand the RMF.WebAPI project expand the appsetings.json file and open appsettings.Development.json under ConnectionStrings you will find the connection string which should look like this:

   `"Data Source=YOUR_SERVER_NAME;Initial Catalog=RMF;Persist Security Info=True;User ID=YOUR_USERNAME;Password=YOUR_PASSWORD"`

   Replace the data source, user id and password with your own database account credentials.

2) Set the path of the Lucene Index directory. Open the RMF.WebAPI project and edit Startup.cs line.21 to your index path:
   `$installPath\DataDump\`

   In production the rmf_lucene_index folder should be placed within the main application folder on the server.

# Running the Project

To run the website project in development mode you must first right click on the Solution Name in the Solution Explorer. In the Startup Project page you should select Multiple Startup Projects and change the Action for RMF.Website and RMF.WebAPI to Start. You can now click the run button and both projects will start.

If the webpage does not load first time you may need to run the following from the command prompt to clear the IIS Express cache:

```
cd "C:\Program Files (x86)\IIS Express\"
appcmd.exe list site /xml | appcmd delete site /in
```

If there is an error saying the Lucene index is open delete `$installPath\DataDump\rmf_lucene_index\write.lock`


