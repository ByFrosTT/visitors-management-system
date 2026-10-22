<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    // Automatically forwards visitors from root URL to login page
    if (session.getAttribute("user") != null) {
        response.sendRedirect("dashboard.jsp");
    } else {
        response.sendRedirect("login.jsp");
    }
%>