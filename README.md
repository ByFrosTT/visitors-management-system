# Visitor Management System — Enterprise Java

A college Enterprise Java web application using Jakarta Servlets, JSP, JDBC and an embedded H2 database.

## Features

Administrator login, dashboard counts, walk-in registration, pre-registration, check-in/check-out, visitor search and deletion.

## Setup

1. Open the folder containing pom.xml as a Maven project in Apache NetBeans.
2. Use JDK 17 and a server supporting Jakarta Servlet 6.0, such as Tomcat 10.1 or a compatible GlassFish server.
3. Set VISITOR_ADMIN_USER and VISITOR_ADMIN_PASSWORD in the environment of the server process. If launching the server through NetBeans, configure these before starting NetBeans and restart the server. No default login credentials are included.
4. Build and deploy. Alternatively run `mvn clean package` and deploy the WAR generated in target/.
5. Open the deployed /VisitorManagement context, or the context configured by your server, and log in using your configured credentials.

H2 creates the visitor table automatically. Its database is stored under the server user's home directory as cvms_db. Database files and compiled output are excluded from version control.

## Structure

- src/main/java/com/ovms: model, DAO and servlet
- src/main/webapp: JSP views and context configuration
- pom.xml: Maven dependencies and WAR packaging

This college demonstration requires server-side authorization and other security hardening before production deployment.
