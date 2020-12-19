@echo off

echo Updating dbseeder dependencies...
cd .\dbseeder
call dotnet add package Microsoft.EntityFrameworkCore.Relational
call dotnet add package Microsoft.EntityFrameworkCore.SqlServer
call dotnet restore --packages nuget-packages

echo Updating AppSupport.Core dependencies...
cd ..\AppSupport.Core
call dotnet add package Microsoft.EntityFrameworkCore
call dotnet restore --packages nuget-packages

echo Updating AppSupport.Data dependencies...
cd ..\AppSupport.Data
call dotnet add package Microsoft.EntityFrameworkCore.SqlServer
call dotnet add package Microsoft.EntityFrameworkCore.Tools
call dotnet restore --packages nuget-packages

echo Updating AppSupport.Identity dependencies...
cd ..\AppSupport.Identity
call dotnet add package Microsoft.Extensions.Configuration.Abstractions
call dotnet add package Microsoft.Extensions.Configuration.Binder
call dotnet add package System.DirectoryServices
call dotnet add package System.DirectoryServices.AccountManagement
call dotnet restore --packages nuget-packages

echo Updating AppSupport.Identity.Mock dependencies...
cd ..\AppSupport.Identity.Mock
call dotnet restore --packages nuget-packages

echo Updating AppSupport.Office dependencies...
cd ..\AppSupport.Office
call dotnet add package DocumentFormat.OpenXml
call dotnet restore --packages nuget-packages

echo Updating AppSupport.Sql dependencies...
cd ..\AppSupport.Sql
call dotnet add package Microsoft.Data.SqlClient
call dotnet add package Newtonsoft.Json
call dotnet restore --packages nuget-packages

echo Updating AppSupport.Web dependencies...
cd ..\AppSupport.Web
call dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson
call dotnet add package Microsoft.EntityFrameworkCore.Design
call dotnet add package Swashbuckle.AspNetCore
call dotnet restore --packages nuget-packages

cd ..
echo Dependencies successfully updated!
